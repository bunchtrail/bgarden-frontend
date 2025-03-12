import L from 'leaflet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { COLORS } from '../../../../styles/global-styles';
import { Specimen } from '../../../specimens/types';
import { useMapContext } from '../../contexts/MapContext';
import { useMapService } from '../../hooks';
import { MapMode } from '../../types';

interface PlantMarkerProps {
  specimen: Specimen;
}

// Функция для создания кастомной иконки маркера
const createCustomIcon = (specimen: Specimen, isSelected: boolean = false) => {
  // Выбор цвета в зависимости от типа растения или статуса
  let color = COLORS.PRIMARY;

  // По типу сектора
  if (specimen.sectorType === 1) {
    // Дендрологический
    color = COLORS.SUCCESS;
  } else if (specimen.sectorType === 2) {
    // Флора
    color = COLORS.PRIMARY;
  } else if (specimen.sectorType === 3) {
    // Цветущие
    color = COLORS.WARNING;
  }

  // Если растение выделено, делаем маркер крупнее
  const size = isSelected ? 2.4 : 2;
  const borderWidth = isSelected ? 2 : 1;

  // Создаем SVG для иконки
  const markerHtmlStyles = `
    background-color: ${color};
    width: ${size}rem;
    height: ${size}rem;
    display: block;
    left: -${size / 2}rem;
    top: -${size / 2}rem;
    position: relative;
    border-radius: ${size}rem ${size}rem 0;
    transform: rotate(45deg);
    border: ${borderWidth}px solid #FFFFFF;
    box-shadow: 0px 0px 4px rgba(0,0,0,0.3);
    ${isSelected ? 'z-index: 1000; animation: pulse 1.5s infinite;' : ''}
  `;

  const icon = L.divIcon({
    className: `custom-plant-marker ${isSelected ? 'selected-marker' : ''}`,
    iconAnchor: [0, 0],
    html: `<span style="${markerHtmlStyles}" />`,
  });

  return icon;
};

const PlantMarker: React.FC<PlantMarkerProps> = ({ specimen }) => {
  const { state, selectSpecimen } = useMapContext();
  const { deleteSpecimen, getMapImageUrl: _getMapImageUrl } = useMapService();
  const markerRef = useRef<L.Marker | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Проверяем, выбрано ли текущее растение
  const isSelected = state.selectedSpecimen?.id === specimen.id;

  // Обработчик удаления образца
  const handleDeleteSpecimen = useCallback(
    async (id: number) => {
      try {
        setIsDeleting(true);

        // Создаем модальное окно для подтверждения удаления
        if (
          window.confirm(
            `Вы уверены, что хотите удалить растение "${
              specimen.russianName || specimen.latinName
            }"?\n\nЭто действие нельзя отменить.`
          )
        ) {
          const success = await deleteSpecimen(id);
          if (success) {
            setDeleteSuccess(true);

            // Добавляем визуальный эффект удаления
            if (markerRef.current && state.mapInstance) {
              // Анимируем маркер перед удалением
              const markerElement = markerRef.current.getElement();
              if (markerElement) {
                markerElement.style.transition = 'all 0.5s ease-out';
                markerElement.style.opacity = '0';
                markerElement.style.transform = 'scale(0.5)';
              }

              // Удаляем после небольшой задержки для анимации
              setTimeout(() => {
                try {
                  if (markerRef.current && state.mapInstance) {
                    markerRef.current.removeFrom(state.mapInstance);
                    markerRef.current = null;
                  }
                } catch (error) {
                  console.error(
                    'Ошибка при анимированном удалении маркера:',
                    error
                  );
                }
              }, 500);
            }

            // Показываем уведомление
            if (state.mode === MapMode.DELETE_PLANT) {
              // Создаем временное уведомление на карте
              const notification = new L.Control({ position: 'topright' });
              notification.onAdd = function () {
                const div = L.DomUtil.create('div', 'delete-notification');
                div.innerHTML = `
                  <div class="bg-green-100 text-green-800 p-3 rounded shadow-md border border-green-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Растение успешно удалено!
                  </div>
                `;
                return div;
              };

              if (state.mapInstance) {
                notification.addTo(state.mapInstance);

                // Удаляем уведомление через 3 секунды
                setTimeout(() => {
                  try {
                    if (state.mapInstance) {
                      notification.remove();
                    }
                  } catch (error) {
                    console.error('Ошибка при удалении уведомления:', error);
                  }
                }, 3000);
              }
            }
          } else {
            console.error(`Не удалось удалить растение с ID ${id}`);
            window.alert(
              `Не удалось удалить растение. Попробуйте снова позже.`
            );
          }
        }
      } catch (error) {
        console.error('Ошибка при удалении растения:', error);
        window.alert(`Произошла ошибка при удалении растения: ${error}`);
      } finally {
        setIsDeleting(false);
      }
    },
    [
      deleteSpecimen,
      specimen.russianName,
      specimen.latinName,
      state.mapInstance,
      state.mode,
    ]
  );

  // Обработчик клика по маркеру
  const handleMarkerClick = useCallback(() => {
    // Если уже идет процесс удаления, игнорируем клики
    if (isDeleting) return;

    switch (state.mode) {
      case MapMode.VIEW:
        // В режиме просмотра просто выбираем образец
        selectSpecimen(specimen);
        break;
      case MapMode.EDIT_PLANT:
        // В режиме редактирования выбираем образец и сохраняем режим
        selectSpecimen(specimen);
        break;
      case MapMode.DELETE_PLANT:
        // В режиме удаления вызываем функцию удаления с подтверждением
        handleDeleteSpecimen(specimen.id);
        break;
      default:
        break;
    }
  }, [state.mode, specimen, selectSpecimen, handleDeleteSpecimen, isDeleting]);

  // Обновляем маркер при изменении выбранного образца
  useEffect(() => {
    if (markerRef.current && state.mapInstance) {
      // Обновляем иконку маркера в зависимости от того, выбран ли образец
      const newIcon = createCustomIcon(specimen, isSelected);
      markerRef.current.setIcon(newIcon);
    }
  }, [isSelected, specimen, state.mapInstance]);

  useEffect(() => {
    // Проверяем, что карта существует и готова
    if (!state.mapInstance || !state.mapReady) {
      console.log(
        `Карта не готова для образца ${specimen.id} (${
          specimen.russianName || specimen.latinName
        })`
      );
      return;
    }

    // Проверяем наличие корректных координат у образца
    if (
      !specimen.latitude ||
      !specimen.longitude ||
      isNaN(specimen.latitude) ||
      isNaN(specimen.longitude)
    ) {
      console.warn(
        `Образец ${specimen.id} (${
          specimen.russianName || specimen.latinName
        }) не имеет корректных координат (lat: ${specimen.latitude}, lng: ${
          specimen.longitude
        })`
      );
      return;
    }

    try {
      // Создаем маркер на карте с проверкой валидности координат
      if (!markerRef.current) {
        console.log(
          `🔍 Создаем маркер для образца ${specimen.id} (${
            specimen.russianName || specimen.latinName
          }), координаты: ${specimen.latitude}, ${specimen.longitude}`
        );

        // Создаем кастомную иконку для маркера
        const customIcon = createCustomIcon(specimen, isSelected);

        markerRef.current = L.marker([specimen.latitude, specimen.longitude], {
          title: specimen.russianName || specimen.latinName,
          icon: customIcon,
        });

        // Добавляем обработчик клика на маркер
        markerRef.current.on('click', handleMarkerClick);

        // Проверяем, поддерживает ли фиктивная карта добавление маркеров
        if (!state.mapInstance.addLayer) {
          console.warn(
            '⚠️ У карты отсутствует метод addLayer! Это может вызвать проблемы.'
          );
        }

        // Привязываем маркер к карте
        try {
          // Используем стандартный метод Leaflet
          markerRef.current.addTo(state.mapInstance);
          console.log(
            `✅ Маркер для образца ${specimen.id} успешно добавлен на карту`
          );

          // Восстанавливаем улучшенный стиль всплывающей подсказки
          try {
            markerRef.current.bindTooltip(
              `<div class="plant-tooltip">
                <strong>${specimen.russianName || specimen.latinName}</strong>
                ${
                  specimen.latinName && specimen.russianName
                    ? `<br><em>${specimen.latinName}</em>`
                    : ''
                }
                <br><span class="text-xs">Инв. №: ${
                  specimen.inventoryNumber
                }</span>
              </div>`,
              {
                className: 'custom-tooltip',
                direction: 'top',
                offset: [0, -10],
              }
            );

            // Визуальный эффект при наведении
            markerRef.current.on('mouseover', function () {
              if (markerRef.current && !isDeleting) {
                const element = markerRef.current.getElement();
                if (element) {
                  element.style.transition = 'transform 0.2s ease';
                  element.style.transform = 'scale(1.1)';
                  element.style.zIndex = '1000';
                }
              }
            });

            markerRef.current.on('mouseout', function () {
              if (markerRef.current && !isDeleting) {
                const element = markerRef.current.getElement();
                if (element) {
                  element.style.transform = 'scale(1)';
                  element.style.zIndex = isSelected ? '1000' : '900';
                }
              }
            });
          } catch (tooltipError) {
            console.warn(
              '⚠️ Не удалось добавить всплывающую подсказку:',
              tooltipError
            );
          }
        } catch (error) {
          console.error(`❌ Ошибка при добавлении маркера на карту:`, error);
          try {
            // Альтернативный способ добавления маркера
            console.log(
              '🔄 Пробуем альтернативный способ добавления маркера через addLayer'
            );
            state.mapInstance.addLayer(markerRef.current);
            console.log(`✅ Маркер добавлен альтернативным способом`);

            // Пробуем добавить всплывающую подсказку и в этом случае тоже
            try {
              markerRef.current.bindTooltip(
                `<div class="plant-tooltip">
                  <strong>${specimen.russianName || specimen.latinName}</strong>
                </div>`,
                { className: 'custom-tooltip' }
              );
            } catch (tooltipError) {
              console.warn(
                '⚠️ Не удалось добавить всплывающую подсказку (alt):',
                tooltipError
              );
            }
          } catch (altError) {
            console.error(
              '❌ Альтернативный способ тоже не сработал:',
              altError
            );
          }
        }
      }
    } catch (error) {
      console.error('❌ Общая ошибка при создании маркера:', error);
    }

    // Очистка при размонтировании компонента
    return () => {
      try {
        if (markerRef.current && state.mapInstance) {
          console.log(`🗑️ Удаляем маркер для образца ${specimen.id}`);
          markerRef.current.removeFrom(state.mapInstance);
          markerRef.current = null;
        }
      } catch (error) {
        console.error('❌ Ошибка при удалении маркера:', error);
        // Пробуем альтернативный способ удаления
        try {
          if (markerRef.current && state.mapInstance) {
            state.mapInstance.removeLayer(markerRef.current);
          }
        } catch (altError) {
          console.error(
            '❌ Альтернативный способ удаления тоже не сработал:',
            altError
          );
        }
      }
    };
  }, [
    specimen,
    state.mapInstance,
    state.mapReady,
    isSelected,
    handleMarkerClick,
    isDeleting,
  ]);

  // Если образец был успешно удален, не рендерим ничего
  if (deleteSuccess) {
    return null;
  }

  // Компонент не рендерит HTML, только взаимодействует с Leaflet
  return null;
};

export default PlantMarker;
