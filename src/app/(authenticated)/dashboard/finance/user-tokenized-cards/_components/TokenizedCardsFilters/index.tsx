"use client";

import * as React from "react";
import { Button, FormControl, FormLabel, Grid, Input } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import { FiltersUserTokenizedCards } from "@/utils/types/finance";
import { initialFilters } from "../../constants";

type TokenizedCardsFiltersProps = {
  filters: FiltersUserTokenizedCards;
  setFilters: React.Dispatch<React.SetStateAction<FiltersUserTokenizedCards>>;
};

export default function TokenizedCardsFilters({
  filters,
  setFilters,
}: TokenizedCardsFiltersProps) {
  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid xs={12} sm={4}>
        <FormControl>
          <FormLabel>Id da pessoa</FormLabel>
          <Input
            placeholder="Filtrar por id da pessoa"
            value={filters.personId}
            onChange={(e) =>
              setFilters({ ...filters, personId: e.target.value })
            }
          />
        </FormControl>
      </Grid>
      <Grid xs={12} sm={4}>
        <FormControl>
          <FormLabel>Provider Id da pessoa</FormLabel>
          <Input
            placeholder="Filtrar provider id da pessoa"
            value={filters.personProviderId}
            onChange={(e) =>
              setFilters({ ...filters, personProviderId: e.target.value })
            }
          />
        </FormControl>
      </Grid>

      <Grid xs={12} sm={4} sx={{ marginTop: "auto" }}>
        <Button
          sx={{
            width: "100%",
          }}
          variant="outlined"
          endDecorator={<DeleteIcon />}
          onClick={() => setFilters(initialFilters)}
        >
          Limpar Filtros
        </Button>
      </Grid>
    </Grid>
  );
}
