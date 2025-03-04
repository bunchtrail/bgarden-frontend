import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  SPACING,
  actionsContainerStyles,
  buttonGroupStyles,
  buttonStyles,
  containerStyles,
  dividerStyles,
  headingStyles,
} from './styles';

interface SpecimenActionsProps {
  currentIndex: number;
  totalCount: number;
  isLoading?: boolean;
  onNavigateFirst: () => void;
  onNavigateLast: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onAddNew: () => void;
  onPrintCurrent: () => void;
  onPrintList: () => void;
  onExportToExcel: () => void;
  onExportToPdf: () => void;
  onViewPhenology?: () => void; // Опционально: переход к фенологическим наблюдениям
  onViewBiometry?: () => void; // Опционально: переход к биометрии (для цветоводства)
  onViewReports: () => void; // Переход к форме запросов
  onExit: () => void;
}

export const SpecimenActions: React.FC<SpecimenActionsProps> = ({
  currentIndex,
  totalCount,
  isLoading = false,
  onNavigateFirst,
  onNavigateLast,
  onNavigatePrev,
  onNavigateNext,
  onAddNew,
  onPrintCurrent,
  onPrintList,
  onExportToExcel,
  onExportToPdf,
  onViewPhenology,
  onViewBiometry,
  onViewReports,
  onExit,
}) => {
  // Стили для заголовков разделов
  const sectionHeadingStyles = {
    ...headingStyles,
  };

  // Стили для кнопок действий
  const actionButtonStyles = {
    ...buttonStyles,
    flex: { xs: '1 0 45%', sm: '0 0 auto' },
  };

  return (
    <Paper sx={containerStyles}>
      {/* Навигация */}
      <Box sx={{ mb: SPACING.MD }}>
        <Typography variant='h6' sx={sectionHeadingStyles}>
          Навигация
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          <ButtonGroup variant='outlined' size='small' sx={buttonGroupStyles}>
            <Tooltip title='Первая запись'>
              <Button
                onClick={onNavigateFirst}
                disabled={isLoading || currentIndex <= 0}
                startIcon={<FirstPageIcon />}
              >
                Первая
              </Button>
            </Tooltip>
            <Tooltip title='Предыдущая запись'>
              <Button
                onClick={onNavigatePrev}
                disabled={isLoading || currentIndex <= 0}
                startIcon={<NavigateBeforeIcon />}
              >
                Пред.
              </Button>
            </Tooltip>
            <Tooltip title='Следующая запись'>
              <Button
                onClick={onNavigateNext}
                disabled={isLoading || currentIndex >= totalCount - 1}
                endIcon={<NavigateNextIcon />}
              >
                След.
              </Button>
            </Tooltip>
            <Tooltip title='Последняя запись'>
              <Button
                onClick={onNavigateLast}
                disabled={isLoading || currentIndex >= totalCount - 1}
                endIcon={<LastPageIcon />}
              >
                Последняя
              </Button>
            </Tooltip>
          </ButtonGroup>

          <Typography sx={{ ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}>
            {totalCount > 0
              ? `Запись ${currentIndex + 1} из ${totalCount}`
              : 'Нет записей'}
          </Typography>
        </Box>

        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={onAddNew}
          disabled={isLoading}
          sx={{ mt: 1, ...buttonStyles }}
        >
          Добавить новый образец
        </Button>
      </Box>

      <Divider sx={dividerStyles} />

      {/* Печать и экспорт */}
      <Box sx={{ mb: SPACING.MD }}>
        <Typography variant='h6' sx={sectionHeadingStyles}>
          Печать и экспорт
        </Typography>
        <ButtonGroup
          variant='outlined'
          size='small'
          orientation='horizontal'
          sx={{
            width: { xs: '100%', sm: 'auto' },
            flexDirection: { xs: 'column', sm: 'row' },
            '& .MuiButton-root': {
              width: { xs: '100%', sm: 'auto' },
              justifyContent: 'flex-start',
            },
          }}
        >
          <Tooltip title='Печать текущей записи'>
            <Button
              onClick={onPrintCurrent}
              disabled={isLoading || totalCount === 0}
              startIcon={<PrintIcon />}
            >
              Печать карточки
            </Button>
          </Tooltip>
          <Tooltip title='Печать списка'>
            <Button
              onClick={onPrintList}
              disabled={isLoading || totalCount === 0}
              startIcon={<PrintIcon />}
            >
              Печать списка
            </Button>
          </Tooltip>
          <Tooltip title='Экспорт в Excel'>
            <Button
              onClick={onExportToExcel}
              disabled={isLoading || totalCount === 0}
              startIcon={<FileDownloadIcon />}
            >
              Excel
            </Button>
          </Tooltip>
          <Tooltip title='Экспорт в PDF'>
            <Button
              onClick={onExportToPdf}
              disabled={isLoading || totalCount === 0}
              startIcon={<FileDownloadIcon />}
            >
              PDF
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>

      <Divider sx={dividerStyles} />

      {/* Переход к другим формам */}
      <Box sx={{ mb: SPACING.MD }}>
        <Typography variant='h6' sx={sectionHeadingStyles}>
          Переход к другим формам
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {onViewPhenology && (
            <Tooltip title='Фенологические наблюдения'>
              <Button
                variant='outlined'
                onClick={onViewPhenology}
                disabled={isLoading || totalCount === 0}
                startIcon={<VisibilityIcon />}
                size='small'
                sx={actionButtonStyles}
              >
                Фенология
              </Button>
            </Tooltip>
          )}

          {onViewBiometry && (
            <Tooltip title='Биометрия'>
              <Button
                variant='outlined'
                onClick={onViewBiometry}
                disabled={isLoading || totalCount === 0}
                startIcon={<MonitorHeartIcon />}
                size='small'
                sx={actionButtonStyles}
              >
                Биометрия
              </Button>
            </Tooltip>
          )}

          <Tooltip title='Запросы'>
            <Button
              variant='outlined'
              onClick={onViewReports}
              disabled={isLoading}
              startIcon={<ListAltIcon />}
              size='small'
              sx={actionButtonStyles}
            >
              Запросы
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={dividerStyles} />

      {/* Выход */}
      <Box sx={actionsContainerStyles}>
        <Button
          variant='contained'
          color='primary'
          onClick={onExit}
          disabled={isLoading}
          startIcon={<ExitToAppIcon />}
          sx={buttonStyles}
        >
          Выход
        </Button>
      </Box>
    </Paper>
  );
};
