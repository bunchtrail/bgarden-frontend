import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import React from 'react';
import { Specimen } from '../types';
import {
  SPACING,
  chipStyles,
  containerStyles,
  wordBreakStyles,
} from './styles';

interface SpecimenCardProps {
  specimen: Specimen;
}

export const SpecimenCard: React.FC<SpecimenCardProps> = ({ specimen }) => {
  // Стили для текста в информационных блоках
  const typographyStyles: SxProps<Theme> = {
    mb: 1,
    ...wordBreakStyles,
  };

  return (
    <Card sx={{ ...containerStyles, mb: SPACING.SM }}>
      <CardContent sx={{ p: { xs: SPACING.SM, sm: SPACING.MD } }}>
        <Grid container spacing={SPACING.SM}>
          <Grid item xs={12}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{
                ...wordBreakStyles,
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
              }}
            >
              {specimen.russianName || specimen.latinName}
            </Typography>
            <Typography variant='subtitle1' color='text.secondary' gutterBottom>
              Инв. номер: {specimen.inventoryNumber}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant='body2' sx={typographyStyles}>
                <strong>Семейство:</strong> {specimen.familyName}
              </Typography>
              <Typography variant='body2' sx={typographyStyles}>
                <strong>Род:</strong> {specimen.genus}
              </Typography>
              <Typography variant='body2' sx={typographyStyles}>
                <strong>Вид:</strong> {specimen.species}
              </Typography>
              <Typography variant='body2' sx={typographyStyles}>
                <strong>Сорт:</strong> {specimen.cultivar}
              </Typography>
              <Typography variant='body2' sx={typographyStyles}>
                <strong>Форма:</strong> {specimen.form}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant='body2' sx={typographyStyles}>
                <strong>Год посадки:</strong> {specimen.plantingYear}
              </Typography>
              <Typography variant='body2' sx={typographyStyles}>
                <strong>Местоположение:</strong> {specimen.expositionName}
              </Typography>
              <Typography variant='body2' sx={typographyStyles}>
                <strong>Определил:</strong> {specimen.determinedBy}
              </Typography>
              <Typography variant='body2' sx={typographyStyles}>
                <strong>Заполнил:</strong> {specimen.filledBy}
              </Typography>
              {specimen.conservationStatus && (
                <Box mt={1}>
                  <Chip
                    label={`Охранный статус: ${specimen.conservationStatus}`}
                    color='warning'
                    size='small'
                    sx={chipStyles}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          {specimen.hasHerbarium && (
            <Grid item xs={12}>
              <Chip
                label='Имеется гербарий'
                color='success'
                size='small'
                sx={{ mr: 1, mb: 1 }}
              />
            </Grid>
          )}

          {specimen.notes && (
            <Grid item xs={12}>
              <Typography
                variant='body2'
                sx={{
                  ...wordBreakStyles,
                  whiteSpace: 'pre-line',
                }}
              >
                <strong>Примечания:</strong> {specimen.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
