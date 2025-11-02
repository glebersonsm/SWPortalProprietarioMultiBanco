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
        <Grid xs={12} sm={gridSize} md={gridSize} sx={{ marginTop: "auto" }}>
          <Button
            sx={{
              width: "100%",
              height: "100%",
              minWidth: "90px",
              bgcolor: "var(--color-button-primary)",
              fontFamily: "Montserrat, sans-serif",
              color: "var(--color-button-text)",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "var(--color-button-primary-hover)",
              },
            }}
            variant="solid"
            endDecorator={<SearchIcon />}
            onClick={handleSearch}
          >
            Pesquisar
          </Button>
        </Grid>
      )}

      <Grid xs={12} sm={gridSize} md={gridSize} sx={{ marginTop: "auto" }}>
        <Button
          sx={{
            width: "100%",
            height: "100%",
            minWidth: "90px",
            bgcolor: "var(--color-button-primary)",
            fontFamily: "Montserrat, sans-serif",
            color: "var(--color-button-text)",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "var(--color-button-primary-hover)",
            },
          }}
          variant="solid"
          endDecorator={<DeleteIcon />}
          onClick={handleClear}
        >
          Limpar Filtros
        </Button>
      </Grid>
    </>
  );
}

