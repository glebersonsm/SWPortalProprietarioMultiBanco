import * as React from "react";
import { Stack, Box, Pagination, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface StorageKeys {
  pageKey: string;
  rowsPerPageKey: string;
}

interface PaginatedListProps<T> {
  items: T[];
  lastPageNumber?: number;
  handleChangePage: (event: React.ChangeEvent<unknown>, value: number) => void;
  page: number;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  useLocalStorage?: boolean;
  storageKeys?: StorageKeys;
}

export default function PaginatedList<T>({
  lastPageNumber,
  handleChangePage,
  page,
  rowsPerPage,
  setRowsPerPage,
  useLocalStorage = false,
  storageKeys = { 
    pageKey: "paginated_list_page",
    rowsPerPageKey: "paginated_list_rows_per_page",
  }
}: PaginatedListProps<T>) {

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
  
  return (
    <Stack spacing={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginTop="8px">
        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel id="rows-per-page-label">Itens por página</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            label="Itens por página"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
            <MenuItem value={300}>300</MenuItem>
            <MenuItem value={400}>400</MenuItem>
          </Select>
        </FormControl>

        <Pagination
          variant="outlined"
          size="large"
          count={lastPageNumber}
          onChange={handleChangePage}
          page={page}
        />
      </Box>
    </Stack>
  );
}
