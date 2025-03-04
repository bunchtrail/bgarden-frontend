import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import React from 'react';
import { Specimen } from '../types';
import styles from './specimens.module.css';
import {
  SPECIMEN_SPACING,
  chipStyles,
  specimenContainerStyles,
  specimenTextStyles,
  wordBreakStyles,
} from './styles';

interface SpecimenCardProps {
  specimen: Specimen;
}

export const SpecimenCard: React.FC<SpecimenCardProps> = ({ specimen }) => {
  return (
    <Card
      sx={{ ...specimenContainerStyles, mb: SPECIMEN_SPACING.SM }}
      className={styles.specimenCard}
    >
      <CardContent
        sx={{ p: { xs: SPECIMEN_SPACING.SM, sm: SPECIMEN_SPACING.MD } }}
      >
        <Grid container spacing={SPECIMEN_SPACING.SM}>
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
              <Typography variant='body2' sx={specimenTextStyles}>
                <strong>Семейство:</strong> {specimen.familyName}
              </Typography>
              <Typography variant='body2' sx={specimenTextStyles}>
                <strong>Род:</strong> {specimen.genus}
              </Typography>
              <Typography variant='body2' sx={specimenTextStyles}>
                <strong>Вид:</strong> {specimen.species}
              </Typography>
              <Typography variant='body2' sx={specimenTextStyles}>
                <strong>Сорт:</strong> {specimen.cultivar}
              </Typography>
              <Typography variant='body2' sx={specimenTextStyles}>
                <strong>Форма:</strong> {specimen.form}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant='body2' sx={specimenTextStyles}>
                <strong>Год посадки:</strong> {specimen.plantingYear}
              </Typography>
              <Typography variant='body2' sx={specimenTextStyles}>
                <strong>Местоположение:</strong> {specimen.expositionName}
              </Typography>
              <Typography variant='body2' sx={specimenTextStyles}>
                <strong>Определил:</strong> {specimen.determinedBy}
              </Typography>
              <Typography variant='body2' sx={specimenTextStyles}>
                <strong>Заполнил:</strong> {specimen.filledBy}
              </Typography>
              {specimen.conservationStatus && (
                <Box mt={1}>
                  <Chip
                    label={`Охранный статус: ${specimen.conservationStatus}`}
                    color='warning'
                    size='small'
                    sx={chipStyles}
                    className={styles.specimenChip}
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
                sx={chipStyles}
                className={styles.specimenChip}
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
