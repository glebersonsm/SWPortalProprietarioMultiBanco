import { Button, Grid, IconButton } from "@mui/joy";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

type SearchAndClearFiltersProps = {
  handleSearch: () => void;
  handleClear: () => void;
  gridSize?: number;
  showUpdateButton?: boolean;
};

export default function SearchAndClearFilters({
  handleClear,
  handleSearch,
  gridSize = 2,
  showUpdateButton = true,
}: SearchAndClearFiltersProps) {
  return (
    <>
      {showUpdateButton && (
        <Grid xs={12} md={2} sx={{ marginTop: "auto" }}>
          <Button
            sx={{
              width: "100%",
              height: "100%",
              minWidth: "150px",
              bgcolor: "#2ca2cc",
              fontFamily: "Montserrat, sans-serif",
              color: "white",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#035781",
              },
            }}
            variant="outlined"
            endDecorator={<SearchIcon />}
            onClick={handleSearch}
          >
            Pesquisar
          </Button>
        </Grid>
      )}

      <Grid xs={12} md={2} sx={{ marginTop: "auto" }}>
        <Button
          sx={{
            width: "100%",
            height: "100%",
            minWidth: "150px",
            bgcolor: "#2ca2cc",
            fontFamily: "Montserrat, sans-serif",
            color: "white",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#035781",
            },
          }}
          variant="outlined"
          endDecorator={<DeleteIcon />}
          onClick={handleClear}
        >
          Limpar Filtros
        </Button>
      </Grid>
    </>
  );
}
