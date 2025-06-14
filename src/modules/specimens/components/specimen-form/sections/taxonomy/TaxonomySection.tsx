import React from 'react';
import { SpecimenFormData } from '../../../../types';
import { FamilyDto } from '../../../../services/familyService';
import { Select, TextField } from '@/modules/ui';
import { animationClasses, layoutClasses } from '@/styles/global-styles';

interface TaxonomySectionProps {
  formData: SpecimenFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  families: FamilyDto[];
}

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({ formData, onChange, families }) => {
  // Подготавливаем опции для выбора семейства
  const familyOptions = [
    { value: 0, label: 'Выберите семейство' },
    ...families.map(family => ({
      value: family.id,
      label: `${family.name}${family.latinName ? ` (${family.latinName})` : ''}`
    }))
  ];

  return (
    <div className={`${animationClasses.fadeIn} space-y-8`}>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Таксономическая информация</h2>
        <p className="text-gray-600">
          Выберите семейство растения и укажите дополнительную таксономическую информацию.
        </p>
      </div>
      
      <div className={`${layoutClasses.grid2} gap-8`}>
        <div className="space-y-5">
          <Select
            id="familyId"
            name="familyId"
            label="Семейство *"
            value={formData.familyId}
            onChange={onChange}
            options={familyOptions}
            fullWidth
            helperText="Выберите семейство, к которому относится растение"
          />
          
          <TextField
            id="synonyms"
            name="synonyms"
            label="Синонимы"
            value={formData.synonyms ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Альтернативные названия растения"
          />
        </div>
        
        <div className="space-y-5">
          <TextField
            id="cultivar"
            name="cultivar"
            label="Культивар"
            value={formData.cultivar ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Культурная форма растения"
          />
          
          <TextField
            id="form"
            name="form"
            label="Форма"
            value={formData.form ?? ''}
            onChange={onChange}
            fullWidth
            helperText="Морфологическая форма растения"
          />
        </div>
      </div>
      
      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-1">Таксономия</h4>
            <p className="text-sm text-green-800">
              Правильная классификация растений поможет в организации коллекции и научной работе. Семейство является обязательным полем.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 