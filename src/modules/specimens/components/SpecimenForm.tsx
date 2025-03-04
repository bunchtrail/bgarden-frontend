import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Specimen, SpecimenFormData } from '../types';
import {
  actionsContainerStyles,
  buttonStyles,
  containerStyles,
  dividerStyles,
  formStyles,
  gridContainerStyles,
  headingStyles,
  subheadingStyles,
} from './styles';

interface SpecimenFormProps {
  initialData?: Specimen;
  onSave: (data: SpecimenFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  // Справочные данные для выпадающих списков могут быть переданы как props
  familyOptions?: { id: number; name: string }[];
  expositionOptions?: { id: number; name: string }[];
  regionOptions?: { id: number; name: string }[];
}

export const SpecimenForm: React.FC<SpecimenFormProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  familyOptions = [],
  expositionOptions = [],
  regionOptions = [],
}) => {
  const emptyFormData: SpecimenFormData = {
    inventoryNumber: '',
    sectorType: 0,
    latitude: 0,
    longitude: 0,
    regionId: 0,
    regionName: '',
    familyId: 0,
    familyName: '',
    russianName: '',
    latinName: '',
    genus: '',
    species: '',
    cultivar: '',
    form: '',
    synonyms: '',
    determinedBy: '',
    plantingYear: new Date().getFullYear(),
    sampleOrigin: '',
    naturalRange: '',
    ecologyAndBiology: '',
    economicUse: '',
    conservationStatus: '',
    expositionId: 0,
    expositionName: '',
    hasHerbarium: false,
    duplicatesInfo: '',
    originalBreeder: '',
    originalYear: 0,
    country: '',
    illustration: '',
    notes: '',
    filledBy: '',
  };

  const [formData, setFormData] = useState<SpecimenFormData>(
    initialData || emptyFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    // Получаем имя для выбранного значения из опций
    let nameValue = '';
    if (name === 'familyId') {
      const selectedFamily = familyOptions.find(
        (option) => option.id === Number(value)
      );
      if (selectedFamily) {
        nameValue = selectedFamily.name;
      }
    } else if (name === 'expositionId') {
      const selectedExposition = expositionOptions.find(
        (option) => option.id === Number(value)
      );
      if (selectedExposition) {
        nameValue = selectedExposition.name;
      }
    } else if (name === 'regionId') {
      const selectedRegion = regionOptions.find(
        (option) => option.id === Number(value)
      );
      if (selectedRegion) {
        nameValue = selectedRegion.name;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
      ...(nameValue ? { [`${name.replace('Id', 'Name')}`]: nameValue } : {}),
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Проверка обязательных полей
    if (!formData.inventoryNumber.trim()) {
      newErrors.inventoryNumber = 'Инвентарный номер обязателен';
    }

    if (!formData.genus.trim()) {
      newErrors.genus = 'Род обязателен';
    }

    if (!formData.species.trim()) {
      newErrors.species = 'Вид обязателен';
    }

    if (formData.familyId === 0) {
      newErrors.familyId = 'Семейство обязательно';
    }

    // Установка ошибок и возврат результата валидации
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Paper sx={containerStyles}>
      <Typography variant='h5' sx={headingStyles}>
        {initialData ? 'Редактирование образца' : 'Новый образец'}
      </Typography>
      <Divider sx={dividerStyles} />

      <Box component='form' onSubmit={handleSubmit} noValidate sx={formStyles}>
        <Grid container sx={gridContainerStyles}>
          {/* Основная информация */}
          <Grid item xs={12}>
            <Typography variant='h6' sx={subheadingStyles}>
              Основная информация
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label='Инвентарный номер'
              name='inventoryNumber'
              value={formData.inventoryNumber}
              onChange={handleChange}
              error={!!errors.inventoryNumber}
              helperText={errors.inventoryNumber}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Семейство</InputLabel>
              <Select
                name='familyId'
                value={
                  formData.familyId !== undefined && formData.familyId !== null
                    ? formData.familyId.toString()
                    : '0'
                }
                onChange={handleSelectChange}
                error={!!errors.familyId}
                disabled={isLoading}
                label='Семейство'
              >
                <MenuItem value='0'>-- Выберите семейство --</MenuItem>
                {familyOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label='Род'
              name='genus'
              value={formData.genus}
              onChange={handleChange}
              error={!!errors.genus}
              helperText={errors.genus}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label='Вид'
              name='species'
              value={formData.species}
              onChange={handleChange}
              error={!!errors.species}
              helperText={errors.species}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Сорт'
              name='cultivar'
              value={formData.cultivar}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Форма'
              name='form'
              value={formData.form}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Определил'
              name='determinedBy'
              value={formData.determinedBy}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>

          {/* Расположение */}
          <Grid item xs={12}>
            <Typography variant='h6' sx={subheadingStyles}>
              Расположение
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Местоположение</InputLabel>
              <Select
                name='expositionId'
                value={formData.expositionId.toString()}
                onChange={handleSelectChange}
                disabled={isLoading}
                label='Местоположение'
              >
                <MenuItem value='0'>-- Выберите местоположение --</MenuItem>
                {expositionOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Год посадки'
              name='plantingYear'
              type='number'
              value={formData.plantingYear || ''}
              onChange={handleNumberChange}
              disabled={isLoading}
            />
          </Grid>

          {/* Дополнительная информация */}
          <Grid item xs={12}>
            <Typography variant='h6' sx={subheadingStyles}>
              Дополнительная информация
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Охранный статус вида'
              name='conservationStatus'
              value={formData.conservationStatus}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Заполнил'
              name='filledBy'
              value={formData.filledBy}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Синонимы'
              name='synonyms'
              value={formData.synonyms}
              onChange={handleChange}
              disabled={isLoading}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Происхождение образца'
              name='sampleOrigin'
              value={formData.sampleOrigin}
              onChange={handleChange}
              disabled={isLoading}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Природный ареал'
              name='naturalRange'
              value={formData.naturalRange}
              onChange={handleChange}
              disabled={isLoading}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Экология и биология вида'
              name='ecologyAndBiology'
              value={formData.ecologyAndBiology}
              onChange={handleChange}
              disabled={isLoading}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Хозяйственное применение'
              name='economicUse'
              value={formData.economicUse}
              onChange={handleChange}
              disabled={isLoading}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Оригинатор'
              name='originalBreeder'
              value={formData.originalBreeder}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Год создания'
              name='originalYear'
              type='number'
              value={formData.originalYear || ''}
              onChange={handleNumberChange}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Страна'
              name='country'
              value={formData.country}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Информация о дубликатах в других гербариях'
              name='duplicatesInfo'
              value={formData.duplicatesInfo}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Иллюстрация'
              name='illustration'
              value={formData.illustration}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasHerbarium}
                  onChange={handleCheckboxChange}
                  name='hasHerbarium'
                  disabled={isLoading}
                />
              }
              label='Наличие гербария'
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Примечание'
              name='notes'
              value={formData.notes}
              onChange={handleChange}
              disabled={isLoading}
              multiline
              rows={4}
            />
          </Grid>

          {/* Действия */}
          <Grid item xs={12}>
            <Box sx={actionsContainerStyles}>
              <Button
                variant='outlined'
                startIcon={<CancelIcon />}
                onClick={onCancel}
                disabled={isLoading}
                sx={buttonStyles}
              >
                Отмена
              </Button>
              <Button
                type='submit'
                variant='contained'
                startIcon={<SaveIcon />}
                disabled={isLoading}
                sx={buttonStyles}
              >
                Сохранить
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
