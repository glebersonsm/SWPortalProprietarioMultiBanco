"use client";

import { Button, FormControl, FormLabel, Grid, Input } from "@mui/joy";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { initialFilters } from "../../constants";
import { FiltersProps } from "@/utils/types/groupImages";

type GroupImagesFiltersProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
};

export default function GroupImagesFilters({
  filters,
  setFilters,
}: GroupImagesFiltersProps) {
  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={6}>
          <FormControl>
            <FormLabel
              sx={{
                color: "var(--color-info-text)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Nome do grupo
            </FormLabel>
            <Input
              placeholder="Filtrar por nome"
              value={filters.name}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                color: "text.primary",
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 0.6,
                },
                "&:hover": {
                  borderColor: "primary.500",
                },
                "&.Mui-focused": {
                  borderColor: "primary.500",
                  boxShadow: "0 0 0 2px var(--card-shadow-color-expanded)",
                },
                "&.Mui-error": {
                  borderColor: "danger.500",
                },
              }}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={3} sx={{ marginTop: "auto" }}>
          <Button
            sx={{
              width: "100%",
              bgcolor: "var(--color-button-primary)",
              fontFamily: "Montserrat, sans-serif",
              color: "var(--color-button-text)",
              fontWeight: 500,
              border: "none",
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
