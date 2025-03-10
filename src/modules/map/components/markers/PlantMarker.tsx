import L from 'leaflet';
import React, { useCallback, useEffect, useRef } from 'react';
import { Specimen } from '../../../specimens/types';
import { useMapContext } from '../../contexts/MapContext';
import { useMapService } from '../../hooks';
import { MapMode } from '../../types';

interface PlantMarkerProps {
  specimen: Specimen;
}

const PlantMarker: React.FC<PlantMarkerProps> = ({ specimen }) => {
  const { state, selectSpecimen } = useMapContext();
  const { deleteSpecimen, getMapImageUrl } = useMapService();
  const markerRef = useRef<L.Marker | null>(null);

  // Обработчик удаления образца
  const handleDeleteSpecimen = useCallback(
    async (id: number) => {
      try {
        const success = await deleteSpecimen(id);
        if (success) {
          // После успешного удаления обновляем список образцов
          // Это произойдет автоматически при перезагрузке PlantLayer
          alert('Растение успешно удалено!');
        } else {
          alert('Не удалось удалить растение');
        }
      } catch (error) {
        console.error('Ошибка при удалении растения:', error);
        alert('Не удалось удалить растение');
      }
    },
    [deleteSpecimen]
  );

  // Обработчик клика по маркеру
  const handleMarkerClick = useCallback(() => {
    switch (state.mode) {
      case MapMode.VIEW:
      case MapMode.EDIT_PLANT:
        // В режиме просмотра или редактирования - выбираем образец
        selectSpecimen(specimen);
        break;
      case MapMode.DELETE_PLANT:
        // В режиме удаления - показываем подтверждение
        if (
          window.confirm(
            `Вы уверены, что хотите удалить растение "${
              specimen.russianName || specimen.latinName
            }"?`
          )
        ) {
          handleDeleteSpecimen(specimen.id);
        }
        break;
      default:
        break;
    }
  }, [state.mode, specimen, selectSpecimen, handleDeleteSpecimen]);

  useEffect(() => {
    // Проверяем, что карта существует и готова
    if (!state.mapInstance || !state.mapReady) {
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
        `Образец ${specimen.id} не имеет корректных координат (lat: ${specimen.latitude}, lng: ${specimen.longitude})`
      );
      return;
    }

    try {
      // Создаем маркер на карте с проверкой валидности координат
      if (!markerRef.current) {
        markerRef.current = L.marker([specimen.latitude, specimen.longitude], {
          title: specimen.russianName || specimen.latinName,
        });

        // Привязываем маркер к карте
        markerRef.current.addTo(state.mapInstance);

        // Добавляем всплывающую подсказку
        markerRef.current.bindTooltip(
          specimen.russianName || specimen.latinName
        );

        // Обработчик клика по маркеру
        markerRef.current.on('click', handleMarkerClick);
      }

      // Очистка при размонтировании
      return () => {
        try {
          if (markerRef.current && state.mapInstance) {
            markerRef.current.removeFrom(state.mapInstance);
            markerRef.current = null;
          }
        } catch (error) {
          console.error('Ошибка при удалении маркера:', error);
        }
      };
    } catch (error) {
      console.error(
        `Ошибка при создании маркера для образца ${specimen.id}:`,
        error
      );
      return undefined;
    }
  }, [
    specimen.id,
    specimen.latitude,
    specimen.longitude,
    specimen.russianName,
    specimen.latinName,
    state.mapReady,
    state.mapInstance,
    handleMarkerClick,
  ]);

  // Компонент не рендерит HTML, только взаимодействует с Leaflet
  return null;
};

export default PlantMarker;
