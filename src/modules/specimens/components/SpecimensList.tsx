import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { SectorType, Specimen, SpecimenFilterParams } from '../types';
import styles from './specimens.module.css';
import {
  SPECIMEN_SPACING,
  headingStyles,
  specimenContainerStyles,
  tableCellStyles,
  tableContainerStyles,
} from './styles';

interface SpecimensListProps {
  specimens: Specimen[];
  onViewSpecimen: (id: number) => void;
  onEditSpecimen: (id: number) => void;
  onSearch: (filterParams: SpecimenFilterParams) => void;
  isLoading?: boolean;
  // Справочные данные для фильтров
  familyOptions?: { id: number; name: string }[];
  sectorOptions?: { id: number; name: string }[];
}

export const SpecimensList: React.FC<SpecimensListProps> = ({
  specimens,
  onViewSpecimen,
  onEditSpecimen,
  onSearch,
  isLoading = false,
  familyOptions = [],
  sectorOptions = [],
}) => {
  // Состояние для пагинации
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Состояние для фильтров
  const [filterParams, setFilterParams] = useState<SpecimenFilterParams>({
    searchField: 'inventoryNumber',
    searchValue: '',
    familyId: undefined,
    sectorType: undefined,
  });

  // Обработчики пагинации
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчики фильтров
  const handleSearchFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterParams((prev) => ({
      ...prev,
      searchField: event.target.value as keyof Specimen,
    }));
  };

  const handleSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterParams((prev) => ({
      ...prev,
      searchValue: event.target.value,
    }));
  };

  const handleFamilyFilterChange = (event: SelectChangeEvent) => {
    setFilterParams((prev) => ({
      ...prev,
      familyId:
        event.target.value === 'all' ? undefined : Number(event.target.value),
    }));
  };

  const handleSectorFilterChange = (event: SelectChangeEvent) => {
    setFilterParams((prev) => ({
      ...prev,
      sectorType:
        event.target.value === 'all'
          ? undefined
          : (Number(event.target.value) as SectorType),
    }));
  };

  const handleSearch = () => {
    onSearch(filterParams);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Отображение образцов с учетом пагинации
  const paginatedSpecimens = specimens.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%' }} className={styles.fadeIn}>
      {/* Фильтры */}
      <Paper sx={specimenContainerStyles}>
        <Toolbar sx={{ pl: { sm: SPECIMEN_SPACING.SM }, pr: { xs: 1, sm: 1 } }}>
          <Typography variant='h6' component='div' sx={headingStyles}>
            Образцы растений
          </Typography>
        </Toolbar>
        <Divider sx={{ mb: SPECIMEN_SPACING.SM }} />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: SPECIMEN_SPACING.SM,
            mb: SPECIMEN_SPACING.SM,
          }}
          className={styles.specimenFilterContainer}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Поле поиска</InputLabel>
            <Select
              value={filterParams.searchField || 'inventoryNumber'}
              onChange={
                handleSearchFieldChange as unknown as (
                  event: SelectChangeEvent<string>
                ) => void
              }
              label='Поле поиска'
              disabled={isLoading}
            >
              <MenuItem value='inventoryNumber'>Инв. номер</MenuItem>
              <MenuItem value='genus'>Род</MenuItem>
              <MenuItem value='species'>Вид</MenuItem>
              <MenuItem value='cultivar'>Сорт</MenuItem>
              <MenuItem value='form'>Форма</MenuItem>
              <MenuItem value='determinedBy'>Определил</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Поиск'
            variant='outlined'
            value={filterParams.searchValue || ''}
            onChange={handleSearchValueChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', gap: SPECIMEN_SPACING.SM }}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Семейство</InputLabel>
            <Select
              value={String(filterParams.familyId || 'all')}
              onChange={handleFamilyFilterChange}
              label='Семейство'
              disabled={isLoading}
            >
              <MenuItem value='all'>Все семейства</MenuItem>
              {familyOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Сектор</InputLabel>
            <Select
              value={String(filterParams.sectorType || 'all')}
              onChange={handleSectorFilterChange}
              label='Сектор'
              disabled={isLoading}
            >
              <MenuItem value='all'>Все секторы</MenuItem>
              {sectorOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}
          >
            <Tooltip title='Применить фильтры'>
              {isLoading ? (
                <span>
                  <IconButton onClick={handleSearch} disabled={true}>
                    <FilterListIcon />
                  </IconButton>
                </span>
              ) : (
                <IconButton onClick={handleSearch} disabled={false}>
                  <FilterListIcon />
                </IconButton>
              )}
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Таблица */}
      <Paper
        sx={{ width: '100%', overflow: 'hidden', mt: SPECIMEN_SPACING.MD }}
      >
        <TableContainer
          sx={tableContainerStyles}
          className={styles.specimenTableContainer}
        >
          <Table
            stickyHeader
            aria-label='таблица образцов растений'
            size='small'
            className={styles.specimensTable}
          >
            <TableHead>
              <TableRow>
                <TableCell>Инв. номер</TableCell>
                <TableCell sx={tableCellStyles('150px')}>Сектор</TableCell>
                <TableCell sx={tableCellStyles('200px')}>Семейство</TableCell>
                <TableCell sx={tableCellStyles('200px')}>Род</TableCell>
                <TableCell sx={tableCellStyles('200px')}>Вид</TableCell>
                <TableCell sx={tableCellStyles('200px')}>Сорт</TableCell>
                <TableCell sx={tableCellStyles('150px')}>Экспозиция</TableCell>
                <TableCell sx={{ width: 100, textAlign: 'center' }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSpecimens.map((specimen) => (
                <TableRow hover key={specimen.id}>
                  <TableCell>{specimen.inventoryNumber}</TableCell>
                  <TableCell sx={tableCellStyles('150px')}>
                    {specimen.sectorType === SectorType.Dendrology
                      ? 'Дендрология'
                      : 'Цветоводство'}
                  </TableCell>
                  <TableCell sx={tableCellStyles('200px')}>
                    {specimen.familyName}
                  </TableCell>
                  <TableCell sx={tableCellStyles('200px')}>
                    {specimen.genus}
                  </TableCell>
                  <TableCell sx={tableCellStyles('200px')}>
                    {specimen.species}
                  </TableCell>
                  <TableCell sx={tableCellStyles('200px')}>
                    {specimen.cultivar}
                  </TableCell>
                  <TableCell sx={tableCellStyles('150px')}>
                    {specimen.expositionName}
                  </TableCell>
                  <TableCell sx={{ width: 100, textAlign: 'center' }}>
                    <Box className={styles.actionButtonsContainer}>
                      <Tooltip title='Просмотр'>
                        <IconButton
                          size='small'
                          onClick={() => onViewSpecimen(specimen.id)}
                        >
                          <VisibilityIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Редактировать'>
                        <IconButton
                          size='small'
                          onClick={() => onEditSpecimen(specimen.id)}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component='div'
          count={specimens.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Строк на странице:'
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} из ${count}`
          }
        />
      </Paper>
    </Box>
  );
};
