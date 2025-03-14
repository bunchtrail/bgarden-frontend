import React, { useCallback, useRef, useEffect } from 'react';
import { OriginSectionProps } from './types';

export const OriginSection: React.FC<OriginSectionProps> = ({
  formData,
  errors,
  touchedFields,
  formSubmitted,
  markFieldAsTouched,
  handleChange,
  handleSelectChange,
  regionOptions,
}) => {
  // Флаг для отслеживания первого монтирования
  const isFirstMount = useRef(true);
  
  // Сохраняем ссылку на select элемент, чтобы иметь возможность программно устанавливать его значение
  const regionSelectRef = useRef<HTMLSelectElement>(null);

  // Используем useRef для отслеживания предыдущего состояния
  const prevFormDataRef = useRef({
    regionId: formData.regionId,
    country: formData.country
  });

  // Добавляем функцию логирования
  const logFormState = useCallback((action: string, data: any = null) => {
    // Проверяем, действительно ли изменились данные
    const hasChanges = 
      prevFormDataRef.current.regionId !== formData.regionId ||
      prevFormDataRef.current.country !== formData.country;

    // Обновляем предыдущее состояние
    prevFormDataRef.current = {
      regionId: formData.regionId,
      country: formData.country
    };

    // Логируем только если есть изменения или это первая инициализация
    if (hasChanges || (action === 'Инициализация компонента' && isFirstMount.current) || data) {
      console.group('🌍 Состояние формы места происхождения');
      console.log('Действие:', action);
      console.log('Текущие данные формы:', {
        regionId: formData.regionId,
        regionName: formData.regionName,
        country: formData.country
      });
      // Добавляем информацию о выбранном в селекте элементе
      if (regionSelectRef.current) {
        console.log('Текущее значение в селекте:', regionSelectRef.current.value);
        console.log('Опция в селекте:', regionSelectRef.current.options[regionSelectRef.current.selectedIndex]?.text);
      }
      if (data) {
        console.log('Новые данные:', data);
      }
      console.log('Ошибки:', {
        regionId: errors.regionId,
        country: errors.country
      });
      console.log('Затронутые поля:', {
        regionId: touchedFields.regionId,
        country: touchedFields.country
      });
      console.log('Доступные регионы:', regionOptions.map(r => `${r.id}: ${r.name}`));
      console.groupEnd();
    }
  }, [formData, errors, touchedFields, regionOptions]);

  // Оборачиваем обработчики для добавления логирования
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegion = regionOptions.find(r => r.id === Number(e.target.value));
    logFormState('Изменение региона', {
      name: e.target.name,
      value: e.target.value,
      selectedRegion
    });
    handleSelectChange(e);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    logFormState('Изменение страны', {
      name: e.target.name,
      value: e.target.value
    });
    handleChange(e);
  };

  // Логируем только при первом монтировании
  useEffect(() => {
    if (isFirstMount.current) {
      logFormState('Инициализация компонента');
      isFirstMount.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Пустой массив зависимостей для вызова только при монтировании

  // Добавляем эффект для гарантированного обновления значения в селекте при каждом рендере
  useEffect(() => {
    // Проверяем, что regionId в formData определен и соответствует списку регионов
    if (formData.regionId !== null && formData.regionId !== undefined && formData.regionId !== 0) {
      const regionExists = regionOptions.some(r => Number(r.id) === Number(formData.regionId));
      
      if (regionExists && regionSelectRef.current) {
        // Текущее значение в селекте
        const selectValue = regionSelectRef.current.value === '' ? null : Number(regionSelectRef.current.value);
        
        // Если значения различаются, обновляем селект
        if (selectValue !== formData.regionId) {
          console.log(`[OriginSection] Принудительная синхронизация селекта с formData.regionId: ${formData.regionId}`);
          regionSelectRef.current.value = String(formData.regionId);
        }
      } else if (!regionExists) {
        console.warn(`[OriginSection] Регион с ID ${formData.regionId} не найден в списке доступных регионов`);
      }
    }
  });
  
  // Обновляем отслеживание изменений formData для более надежного обновления значения селекта
  useEffect(() => {
    // Проверяем, что это не первый рендер и есть изменения
    if (!isFirstMount.current) {
      const hasChanges = 
        prevFormDataRef.current.regionId !== formData.regionId ||
        prevFormDataRef.current.country !== formData.country;

      if (hasChanges) {
        logFormState('Обновление после клика на карту');
        
        // Проверяем, соответствует ли текущее значение селекта значению regionId в formData
        if (regionSelectRef.current) {
          const selectValue = regionSelectRef.current.value === '' ? null : Number(regionSelectRef.current.value);
          const formValue = formData.regionId === null || formData.regionId === undefined || formData.regionId === 0 ? null : formData.regionId;
          
          // Проверяем, есть ли доступный регион с таким ID
          const isValidRegion = formValue !== null && regionOptions.some(r => Number(r.id) === Number(formValue));
          
          // Выводим подробную диагностику
          console.log('Текущие доступные регионы:', regionOptions.map(r => ({ id: r.id, name: r.name })));
          console.log('Значение regionId существует в списке доступных регионов:', isValidRegion);
          console.log('Текущее значение в formData.regionId:', formValue, 'тип:', typeof formValue);
          console.log('Текущее значение в селекте:', selectValue, 'тип:', typeof selectValue);
          
          if (selectValue !== formValue && formValue !== null) {
            console.log('Обнаружено несоответствие значения селекта и formData.regionId');
            console.log('Значение в formData:', formValue);
            console.log('Значение в селекте:', selectValue);
            
            if (isValidRegion) {
              // Устанавливаем значение селекта равным formData.regionId
              console.log('Устанавливаем значение селекта равным formData.regionId:', formValue);
              // Поиск активного региона
              const selectedRegion = regionOptions.find(r => Number(r.id) === Number(formValue));
              console.log('Найден регион:', selectedRegion);
              
              // Программно устанавливаем значение селекта с небольшой задержкой
              setTimeout(() => {
                if (regionSelectRef.current) {
                  regionSelectRef.current.value = String(formValue);
                  console.log('Селект обновлен на значение:', String(formValue));
                  
                  // Создаем и запускаем событие change для обновления связанного состояния
                  const event = new Event('change', { bubbles: true });
                  regionSelectRef.current.dispatchEvent(event);
                }
              }, 10);
            } else {
              console.warn(`Невозможно установить значение ${formValue} в селект - такого значения нет в списке`);
            }
          }
        }
        
        // Проверяем кейс, когда regionId сбросился до null, но regionName сохранился
        if ((formData.regionId === null || formData.regionId === 0) && formData.regionName && regionOptions.length > 0) {
          // Ищем регион по имени
          const regionByName = regionOptions.find(r => r.name === formData.regionName);
          
          if (regionByName) {
            console.log(`Обнаружен сброс regionId при сохранении regionName. Восстанавливаем значение по имени ${formData.regionName}: ${regionByName.id}`);
            
            // Создаем искусственное событие select для восстановления значения
            const event = {
              target: {
                name: 'regionId',
                value: String(regionByName.id)
              }
            } as React.ChangeEvent<HTMLSelectElement>;
            
            // Вызываем обработчик
            handleSelectChange(event);
          }
        }
      }
    }
  }, [formData, logFormState, regionOptions, handleSelectChange]);

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:border-green-200">
      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
        <span className="mr-2">🌍</span>
        Место происхождения
      </h4>
      <div className="space-y-4">
        <div className="mb-5 transition-all duration-300 rounded-lg p-3 focus-within:bg-gray-50/80">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
            <label
              htmlFor="regionId"
              className="block text-sm font-medium text-gray-700 sm:w-1/3 sm:py-2 transition-colors duration-200"
            >
              Регион происхождения
              <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <div className="mt-1 sm:mt-0 sm:w-2/3 relative">
              <select
                ref={regionSelectRef}
                id="regionId"
                name="regionId"
                className={`rounded-lg w-full border border-gray-300 px-4 py-2.5 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.regionId && (touchedFields.regionId || formSubmitted)
                    ? 'border-red-500 bg-red-50'
                    : touchedFields.regionId
                    ? 'border-green-400 ring-1 ring-green-200 bg-green-50'
                    : 'border-gray-300 bg-white hover:border-blue-300'
                } transition-all duration-300 ease-in-out pr-10 appearance-none`}
                value={formData.regionId !== null && formData.regionId !== undefined && formData.regionId !== 0 ? String(formData.regionId) : ''}
                onChange={handleRegionChange}
                onBlur={() => markFieldAsTouched('regionId')}
                required
                aria-invalid={!!errors.regionId}
              >
                <option value="">Выберите регион происхождения</option>
                {regionOptions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name} ({region.id})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-5 transition-all duration-300 rounded-lg p-3 focus-within:bg-gray-50/80">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 sm:w-1/3 sm:py-2 transition-colors duration-200"
            >
              Страна происхождения
            </label>
            <div className="mt-1 sm:mt-0 sm:w-2/3 relative">
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country || ''}
                onChange={handleCountryChange}
                onBlur={() => markFieldAsTouched('country')}
                className={`rounded-lg w-full border border-gray-300 px-4 py-2.5 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.country && (touchedFields.country || formSubmitted)
                    ? 'border-red-500 bg-red-50'
                    : touchedFields.country
                    ? 'border-green-400 ring-1 ring-green-200 bg-green-50'
                    : 'border-gray-300 bg-white hover:border-blue-300'
                } transition-all duration-300 ease-in-out transition-transform duration-300 hover:scale-[1.01] focus:scale-[1.01]`}
                placeholder="Введите страна происхождения"
                aria-invalid={!!errors.country}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OriginSection; 
