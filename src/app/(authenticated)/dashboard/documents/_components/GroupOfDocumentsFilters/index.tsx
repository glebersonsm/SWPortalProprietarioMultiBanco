"use client";

import { Button, FormControl, FormLabel, Grid, Input } from "@mui/joy";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { initialFilters } from "../../constants";
import { FiltersProps } from "@/utils/types/documents";

type GroupOfDocumentsFiltersProps = {
  value: FiltersProps;
  setValue: React.Dispatch<React.SetStateAction<FiltersProps>>;
};

export default function GroupOfDocumentsFilters({
  value,
  setValue,
}: GroupOfDocumentsFiltersProps) {
  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={3}>
          <FormControl>
            <FormLabel
              sx={{
                color: "var(--color-label-text-doc)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Nome
            </FormLabel>
            <Input
              placeholder="Filtrar por nome do grupo de documentos"
              value={value.name}
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
                  boxShadow: "0 0 0 2px rgba(44, 162, 204, 0.2)",
                },
                "&.Mui-error": {
                  borderColor: "danger.500",
                },
              }}
              onChange={(e) => setValue({ ...value, name: e.target.value })}
            />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={2} sx={{ marginTop: "auto" }}>
          <Button
            sx={{
              width: "100%",
              bgcolor: "var(--color-button-primary)",
              color: "var(--color-button-text)",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              border: "none",
              "&:hover": {
                bgcolor: "var(--color-button-primary-hover)",
              },
            }}
            variant="solid"
            endDecorator={<DeleteIcon />}
            onClick={() => setValue(initialFilters)}
          >
            Limpar Filtros
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
