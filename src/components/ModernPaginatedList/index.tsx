import * as React from "react";
import { Stack, Box, Pagination, Select, MenuItem, FormControl, InputLabel, TextField, IconButton, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight, FirstPage, LastPage } from "@mui/icons-material";

interface StorageKeys {
  pageKey: string;
  rowsPerPageKey: string;
}

interface ModernPaginatedListProps<T> {
  items: readonly T[];
  lastPageNumber?: number;
  handleChangePage: (event: React.ChangeEvent<unknown>, value: number) => void;
  page: number;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  useLocalStorage?: boolean;
  storageKeys?: StorageKeys;
}

export default function ModernPaginatedList<T>({
  lastPageNumber,
  handleChangePage,
  page,
  rowsPerPage,
  setRowsPerPage,
  useLocalStorage = false,
  storageKeys = { 
    pageKey: "modern_paginated_list_page",
    rowsPerPageKey: "modern_paginated_list_rows_per_page",
  }
}: ModernPaginatedListProps<T>) {
  const [pageInput, setPageInput] = React.useState(page.toString());

  React.useEffect(() => {
    setPageInput(page.toString());
  }, [page]);

  React.useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem(storageKeys.pageKey, page.toString());
    }
  }, [page, useLocalStorage, storageKeys.pageKey]);

  React.useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem(storageKeys.rowsPerPageKey, rowsPerPage.toString());
    }
  }, [rowsPerPage, useLocalStorage, storageKeys.rowsPerPageKey]);

  const handleChangeRowsPerPage = (event: any) => {
    const newValue = Number(event.target.value);
    setRowsPerPage(newValue);
    handleChangePage(event, 1);
  };

  const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(event.target.value);
  };

  const handlePageInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newPage = parseInt(pageInput);
      if (newPage >= 1 && newPage <= (lastPageNumber || 1)) {
        handleChangePage(event as any, newPage);
      } else {
        setPageInput(page.toString());
      }
    }
  };

  const handlePageInputBlur = () => {
    const newPage = parseInt(pageInput);
    if (newPage >= 1 && newPage <= (lastPageNumber || 1)) {
      handleChangePage({} as any, newPage);
    } else {
      setPageInput(page.toString());
    }
  };

  const handleFirstPage = () => {
    handleChangePage({} as any, 1);
  };

  const handleLastPage = () => {
    handleChangePage({} as any, lastPageNumber || 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      handleChangePage({} as any, page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < (lastPageNumber || 1)) {
      handleChangePage({} as any, page + 1);
    }
  };
  
  return (
    <Stack spacing={2}>
      <Box display="flex" alignItems="center" justifyContent="flex-end" marginTop="8px" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton 
            onClick={handleFirstPage} 
            disabled={page === 1}
            size="small"
            title="Primeira página"
          >
          <FirstPage />
          </IconButton>
          
          <IconButton 
            onClick={handlePreviousPage} 
            disabled={page === 1}
            size="small"
            title="Página anterior"
          >
            <KeyboardArrowLeft />
          </IconButton>

            <Typography variant="body2">Página</Typography>
            <TextField
              size="small"
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyPress={handlePageInputSubmit}
              onBlur={handlePageInputBlur}
              inputProps={{
                style: { textAlign: 'center', width: '60px' },
                min: 1,
                max: lastPageNumber || 1
              }}
              type="number"
            />
            <Typography variant="body2">de {lastPageNumber || 1}</Typography>

          <IconButton 
            onClick={handleNextPage} 
            disabled={page === (lastPageNumber || 1)}
            size="small"
            title="Próxima página"
          >
            <KeyboardArrowRight />
          </IconButton>
          
          <IconButton 
            onClick={handleLastPage} 
            disabled={page === (lastPageNumber || 1)}
            size="small"
            title="Última página"
          >
            <LastPage />
          </IconButton>
        </Box>
        
        <FormControl variant="outlined" size="small" style={{ minWidth: 140 }}>
          <InputLabel id="rows-per-page-label">Itens por página</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            label="Itens por página"
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
            <MenuItem value={300}>300</MenuItem>
            <MenuItem value={400}>400</MenuItem>
            <MenuItem value={600}>600</MenuItem>
            <MenuItem value={800}>800</MenuItem>
            <MenuItem value={1000}>1000</MenuItem>
            <MenuItem value={1200}>1200</MenuItem>  
            <MenuItem value={1500}>1500</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Stack>
  );
}