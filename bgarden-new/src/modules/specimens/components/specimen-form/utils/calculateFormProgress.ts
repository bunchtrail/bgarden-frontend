import { SpecimenFormData } from '../../../types';

/**
 * Функция для расчета прогресса заполнения формы
 * Учитывает обязательные и необязательные поля с разным весом
 * 
 * @param formData - Данные формы образца
 * @returns Процент заполнения формы (0-100)
 */
export const calculateFormProgress = (formData: SpecimenFormData): number => {
  const requiredFields = [
    'inventoryNumber', 'russianName', 'latinName', 'genus', 'species',
    'familyId', 'familyName', 'latitude', 'longitude', 'regionId'
  ];
  
  const optionalFields = [
    'cultivar', 'form', 'synonyms', 'determinedBy', 'plantingYear',
    'sampleOrigin', 'naturalRange', 'ecologyAndBiology', 'economicUse',
    'conservationStatus', 'hasHerbarium', 'duplicatesInfo', 'originalBreeder',
    'originalYear', 'country', 'illustration', 'notes', 'filledBy'
  ];
  
  // Считаем заполненные обязательные поля (вес 70%)
  const requiredFieldsCount = requiredFields.length;
  const filledRequiredFields = requiredFields.filter(field => {
    const value = formData[field as keyof SpecimenFormData];
    return value !== undefined && value !== null && value !== '';
  }).length;
  
  // Считаем заполненные опциональные поля (вес 30%)
  const optionalFieldsCount = optionalFields.length;
  const filledOptionalFields = optionalFields.filter(field => {
    const value = formData[field as keyof SpecimenFormData];
    return value !== undefined && value !== null && value !== '';
  }).length;
  
  // Считаем общий прогресс с весами
  const requiredProgress = (filledRequiredFields / requiredFieldsCount) * 70;
  const optionalProgress = (filledOptionalFields / optionalFieldsCount) * 30;
  
  return requiredProgress + optionalProgress;
}; 