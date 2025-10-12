"use client";

import { Button, FormControl, FormLabel, Grid, Input } from "@mui/joy";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { initialFilters } from "../../constants";
import { FiltersProps } from "@/utils/types/multiownership/properties";

const FILTERS_STORAGE_KEY = "properties_filters";

type MultiownershipFilterProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
};

export default function MultiownershipFilters({
  filters,
  setFilters,
}: MultiownershipFilterProps) {
  const [isFiltersLoaded, setIsFiltersLoaded] = React.useState(false);

  React.useEffect(() => {
    const savedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);

    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        if (
          parsedFilters &&
          JSON.stringify(parsedFilters) !== JSON.stringify(initialFilters)
        ) {
          setFilters(parsedFilters);
        }
      } catch (error) {
        console.error("Erro ao carregar filtros:", error);
        setFilters(initialFilters);
      }
    } else {
      setFilters(initialFilters);
    }

    setIsFiltersLoaded(true);
  }, [setFilters]);

  React.useEffect(() => {
    if (isFiltersLoaded) {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    }
  }, [filters, isFiltersLoaded]);

  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={5}>
          <FormControl>
            <FormLabel
              sx={{
                color: "primary.solidHoverBg",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Imóvel
            </FormLabel>
            <Input
              placeholder="Filtrar pelo imóvel"
              value={filters.propertyNumber}
              onChange={(e) =>
                setFilters({ ...filters, propertyNumber: e.target.value })
              }
            />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel
              sx={{
                color: "primary.solidHoverBg",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Código do bloco
            </FormLabel>
            <Input
              placeholder="Filtrar por código do bloco"
              value={filters.blockCode}
              onChange={(e) =>
                setFilters({ ...filters, blockCode: e.target.value })
              }
            />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={3} sx={{ marginTop: "auto" }}>
          <Button
            sx={{
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
            onClick={() => setFilters(initialFilters)}
          >
            Limpar Filtros
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
