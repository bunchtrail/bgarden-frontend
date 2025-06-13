import React from 'react';
import { Switch, TextField, Textarea } from '@/modules/ui';
import { SpecimenFormData } from '../../../../types';
import { animationClasses, layoutClasses } from '@/styles/global-styles';

interface AdditionalInfoSectionProps {
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ formData, onChange }) => {
  
  const handleHerbariumChange = () => {
    // Создаем синтетическое событие с нужными свойствами
    const syntheticEvent = {
      target: {
        name: 'hasHerbarium',
        type: 'checkbox',
        checked: !formData.hasHerbarium,
        value: (!formData.hasHerbarium).toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };
  
  return (
    <div className={`${animationClasses.fadeIn} space-y-8`}>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Дополнительная информация</h2>
        <p className="text-gray-600">
          Укажите дополнительные сведения об образце: происхождение, экологические особенности и другую важную информацию.
        </p>
      </div>
      
      <div className={`${layoutClasses.grid2} gap-8`}>
        <div className="space-y-5">
          <TextField
            id="plantingYear"
            name="plantingYear"
            label="Год посадки"
            type="number"
            value={formData.plantingYear ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Год, когда растение было посажено"
          />
          
          <TextField
            id="sampleOrigin"
            name="sampleOrigin"
            label="Происхождение образца"
            value={formData.sampleOrigin ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Откуда был получен образец"
          />
          
          <TextField
            id="naturalRange"
            name="naturalRange"
            label="Естественный ареал"
            value={formData.naturalRange ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Природное распространение вида"
          />
          
          <TextField
            id="determinedBy"
            name="determinedBy"
            label="Определено кем"
            value={formData.determinedBy ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Кто определил таксономическую принадлежность"
          />
        </div>
        
        <div className="space-y-5">
          <TextField
            id="ecologyAndBiology"
            name="ecologyAndBiology"
            label="Экология и биология"
            value={formData.ecologyAndBiology ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Экологические особенности растения"
          />
          
          <TextField
            id="economicUse"
            name="economicUse"
            label="Хозяйственное использование"
            value={formData.economicUse ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Практическое применение растения"
          />
          
          <TextField
            id="conservationStatus"
            name="conservationStatus"
            label="Охранный статус"
            value={formData.conservationStatus ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Статус охраны в природе"
          />
          
          <div className="pt-4">
            <Switch
              label="Имеется гербарий"
              checked={formData.hasHerbarium}
              onChange={handleHerbariumChange}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-5">
        <TextField
          id="duplicatesInfo"
          name="duplicatesInfo"
          label="Информация о дублетах"
          value={formData.duplicatesInfo ?? ''}
          onChange={onChange}
          fullWidth
          helperText="Сведения о дублирующих образцах"
        />
        
        <Textarea
          id="notes"
          name="notes"
          label="Примечания"
          value={formData.notes ?? ''}
          onChange={onChange}
          rows={4}
          fullWidth
          helperText="Дополнительные заметки об образце"
        />
      </div>
      
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">Дополнительные сведения</h4>
            <p className="text-sm text-purple-800">
              Эта информация не является обязательной, но поможет создать более полную характеристику образца для научной работы.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 