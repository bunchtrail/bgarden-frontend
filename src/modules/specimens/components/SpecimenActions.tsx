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
              {isLoading || currentIndex <= 0 ? (
                <span style={{ display: 'inline-block' }}>
                  <Button
                    onClick={onNavigateFirst}
                    disabled={true}
                    startIcon={<FirstPageIcon />}
                  >
                    Первая
                  </Button>
                </span>
              ) : (
                <Button
                  onClick={onNavigateFirst}
                  disabled={false}
                  startIcon={<FirstPageIcon />}
                >
                  Первая
                </Button>
              )}
            </Tooltip>
            <Tooltip title='Предыдущая запись'>
              {isLoading || currentIndex <= 0 ? (
                <span style={{ display: 'inline-block' }}>
                  <Button
                    onClick={onNavigatePrev}
                    disabled={true}
                    startIcon={<NavigateBeforeIcon />}
                  >
                    Пред.
                  </Button>
                </span>
              ) : (
                <Button
                  onClick={onNavigatePrev}
                  disabled={false}
                  startIcon={<NavigateBeforeIcon />}
                >
                  Пред.
                </Button>
              )}
            </Tooltip>
            <Tooltip title='Следующая запись'>
              {isLoading || currentIndex >= totalCount - 1 ? (
                <span style={{ display: 'inline-block' }}>
                  <Button
                    onClick={onNavigateNext}
                    disabled={true}
                    endIcon={<NavigateNextIcon />}
                  >
                    След.
                  </Button>
                </span>
              ) : (
                <Button
                  onClick={onNavigateNext}
                  disabled={false}
                  endIcon={<NavigateNextIcon />}
                >
                  След.
                </Button>
              )}
            </Tooltip>
            <Tooltip title='Последняя запись'>
              {isLoading || currentIndex >= totalCount - 1 ? (
                <span style={{ display: 'inline-block' }}>
                  <Button
                    onClick={onNavigateLast}
                    disabled={true}
                    endIcon={<LastPageIcon />}
                  >
                    Последняя
                  </Button>
                </span>
              ) : (
                <Button
                  onClick={onNavigateLast}
                  disabled={false}
                  endIcon={<LastPageIcon />}
                >
                  Последняя
                </Button>
              )}
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
            {isLoading || totalCount === 0 ? (
              <span style={{ display: 'inline-block' }}>
                <Button
                  onClick={onPrintCurrent}
                  disabled={true}
                  startIcon={<PrintIcon />}
                >
                  Печать карточки
                </Button>
              </span>
            ) : (
              <Button
                onClick={onPrintCurrent}
                disabled={false}
                startIcon={<PrintIcon />}
              >
                Печать карточки
              </Button>
            )}
          </Tooltip>
          <Tooltip title='Печать списка'>
            {isLoading || totalCount === 0 ? (
              <span style={{ display: 'inline-block' }}>
                <Button
                  onClick={onPrintList}
                  disabled={true}
                  startIcon={<PrintIcon />}
                >
                  Печать списка
                </Button>
              </span>
            ) : (
              <Button
                onClick={onPrintList}
                disabled={false}
                startIcon={<PrintIcon />}
              >
                Печать списка
              </Button>
            )}
          </Tooltip>
          <Tooltip title='Экспорт в Excel'>
            {isLoading || totalCount === 0 ? (
              <span style={{ display: 'inline-block' }}>
                <Button
                  onClick={onExportToExcel}
                  disabled={true}
                  startIcon={<FileDownloadIcon />}
                >
                  Excel
                </Button>
              </span>
            ) : (
              <Button
                onClick={onExportToExcel}
                disabled={false}
                startIcon={<FileDownloadIcon />}
              >
                Excel
              </Button>
            )}
          </Tooltip>
          <Tooltip title='Экспорт в PDF'>
            {isLoading || totalCount === 0 ? (
              <span style={{ display: 'inline-block' }}>
                <Button
                  onClick={onExportToPdf}
                  disabled={true}
                  startIcon={<FileDownloadIcon />}
                >
                  PDF
                </Button>
              </span>
            ) : (
              <Button
                onClick={onExportToPdf}
                disabled={false}
                startIcon={<FileDownloadIcon />}
              >
                PDF
              </Button>
            )}
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
              {isLoading || totalCount === 0 ? (
                <span style={{ display: 'inline-block' }}>
                  <Button
                    variant='outlined'
                    onClick={onViewPhenology}
                    disabled={true}
                    startIcon={<VisibilityIcon />}
                    size='small'
                    sx={actionButtonStyles}
                  >
                    Фенология
                  </Button>
                </span>
              ) : (
                <Button
                  variant='outlined'
                  onClick={onViewPhenology}
                  disabled={false}
                  startIcon={<VisibilityIcon />}
                  size='small'
                  sx={actionButtonStyles}
                >
                  Фенология
                </Button>
              )}
            </Tooltip>
          )}

          {onViewBiometry && (
            <Tooltip title='Биометрия'>
              {isLoading || totalCount === 0 ? (
                <span style={{ display: 'inline-block' }}>
                  <Button
                    variant='outlined'
                    onClick={onViewBiometry}
                    disabled={true}
                    startIcon={<MonitorHeartIcon />}
                    size='small'
                    sx={actionButtonStyles}
                  >
                    Биометрия
                  </Button>
                </span>
              ) : (
                <Button
                  variant='outlined'
                  onClick={onViewBiometry}
                  disabled={false}
                  startIcon={<MonitorHeartIcon />}
                  size='small'
                  sx={actionButtonStyles}
                >
                  Биометрия
                </Button>
              )}
            </Tooltip>
          )}

          <Tooltip title='Запросы'>
            {isLoading ? (
              <span style={{ display: 'inline-block' }}>
                <Button
                  variant='outlined'
                  onClick={onViewReports}
                  disabled={true}
                  startIcon={<ListAltIcon />}
                  size='small'
                  sx={actionButtonStyles}
                >
                  Запросы
                </Button>
              </span>
            ) : (
              <Button
                variant='outlined'
                onClick={onViewReports}
                disabled={false}
                startIcon={<ListAltIcon />}
                size='small'
                sx={actionButtonStyles}
              >
                Запросы
              </Button>
            )}
          </Tooltip>

          <Tooltip title='Выход'>
            {isLoading ? (
              <span style={{ display: 'inline-block' }}>
                <Button
                  variant='outlined'
                  onClick={onExit}
                  disabled={true}
                  startIcon={<ExitToAppIcon />}
                  size='small'
                  sx={actionButtonStyles}
                >
                  Выход
                </Button>
              </span>
            ) : (
              <Button
                variant='outlined'
                onClick={onExit}
                disabled={false}
                startIcon={<ExitToAppIcon />}
                size='small'
                sx={actionButtonStyles}
              >
                Выход
              </Button>
            )}
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
