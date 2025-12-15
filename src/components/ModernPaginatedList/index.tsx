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
  handleChangePage: ((event: React.ChangeEvent<unknown>, value: number) => void) | ((value: number) => void);
  page: number;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  useLocalStorage?: boolean;
  storageKeys?: StorageKeys;
}

export default function ModernPaginatedList<T>({
  items,
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
  const initializedRef = React.useRef(false);
  const callHandleChangePage = (value: number, event?: any) => {
    const fn: any = handleChangePage as any;
    try {
      if (typeof fn === 'function' && fn.length >= 2) {
        fn(event ?? ({} as any), value);
      } else {
        fn(value);
      }
    } catch {
      try { fn(value); } catch {}
    }
  };

  const effectiveLastPage = React.useMemo(() => {
    const last = Math.max(1, lastPageNumber || 1);
    if (page === 1 && Array.isArray(items) && items.length < rowsPerPage) {
      return 1;
    }
    return last;
  }, [lastPageNumber, page, rowsPerPage, items]);

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

  // Inicializa page e rowsPerPage com valores persistidos (quando habilitado)
  React.useEffect(() => {
    if (!useLocalStorage || initializedRef.current) return;
    try {
      const storedRowsPerPage = Number(localStorage.getItem(storageKeys.rowsPerPageKey));
      const storedPage = Number(localStorage.getItem(storageKeys.pageKey));

      if (Number.isFinite(storedRowsPerPage) && storedRowsPerPage > 0) {
        setRowsPerPage(storedRowsPerPage);
      }

      if (Number.isFinite(storedPage) && storedPage >= 1) {
        const clampedPage = Math.min(storedPage, effectiveLastPage);
        callHandleChangePage(clampedPage);
      }

      initializedRef.current = true;
    } catch {
      // ignora erros de acesso ao localStorage
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocalStorage, storageKeys.pageKey, storageKeys.rowsPerPageKey, lastPageNumber, effectiveLastPage]);

  // Garante consistência quando o total de páginas diminui (ex.: filtros alterados)
  React.useEffect(() => {
    if (page > effectiveLastPage) {
      const timer = setTimeout(() => {
        callHandleChangePage(effectiveLastPage);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [effectiveLastPage, page, handleChangePage]);

  const handleChangeRowsPerPage = (event: any) => {
    const newValue = Number(event.target.value);
    setRowsPerPage(newValue);
    callHandleChangePage(1, event);
  };

  const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(event.target.value);
  };

  const clampPage = (value: number) => {
    if (!Number.isFinite(value)) return page;
    return Math.min(Math.max(1, value), effectiveLastPage);
  };

  const handlePageInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newPage = clampPage(parseInt(pageInput, 10));
      if (newPage !== page) {
        callHandleChangePage(newPage, event);
      } else {
        setPageInput(page.toString());
      }
    }
  };

  const handlePageInputBlur = () => {
    const newPage = clampPage(parseInt(pageInput, 10));
    if (newPage !== page) {
      callHandleChangePage(newPage);
    } else {
      setPageInput(page.toString());
    }
  };

  const handleFirstPage = () => {
    callHandleChangePage(1);
  };

  const handleLastPage = () => {
    callHandleChangePage(effectiveLastPage);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      callHandleChangePage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < effectiveLastPage) {
      callHandleChangePage(page + 1);
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
              onKeyDown={handlePageInputKeyDown}
              onBlur={handlePageInputBlur}
              inputProps={{
                style: { textAlign: 'center', width: '60px' },
                min: 1,
                max: effectiveLastPage,
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
              type="number"
              onWheel={(e) => {
                // Evita alteração do número ao rolar o mouse
                (e.target as HTMLInputElement).blur();
              }}
            />
            <Typography variant="body2">de {effectiveLastPage}</Typography>

          <IconButton 
            onClick={handleNextPage} 
            disabled={page === effectiveLastPage}
            size="small"
            title="Próxima página"
          >
            <KeyboardArrowRight />
          </IconButton>
          
          <IconButton 
            onClick={handleLastPage} 
            disabled={page === effectiveLastPage}
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








