"use client";

import { Button, FormControl, FormLabel, Grid, Input } from "@mui/joy";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { initialFilters } from "../../constants";
import FilterByDateInput from "@/components/FilterByDateInput";
import { FiltersProps } from "@/utils/types/user-time-sharing-ReservesWrittenOff";

type UserReserveWrittenOffFiltersProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
};

export default function UserReserveWrittenOffFilters({
  filters,
  setFilters,
}: UserReserveWrittenOffFiltersProps) {
  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={3}>
          <FilterByDateInput
            label="Checkin inicial"
            value={filters.initialCheckin}
            onChange={(e) =>
              setFilters({ ...filters, initialCheckin: e.target.value })
            }
          />
        </Grid>
        <Grid xs={12} sm={3}>
          <FilterByDateInput
            label="Checkin final"
            value={filters.finalCheckin}
            onChange={(e) =>
              setFilters({ ...filters, finalCheckin: e.target.value })
            }
          />
        </Grid>
        <Grid xs={12} sm={3}>
          <FilterByDateInput
            label="Checkout inicial"
            value={filters.initialCheckout}
            onChange={(e) =>
              setFilters({ ...filters, initialCheckout: e.target.value })
            }
          />
        </Grid>
        <Grid xs={12} sm={3}>
          <FilterByDateInput
            label="Checkout final"
            value={filters.finalCheckout}
            onChange={(e) =>
              setFilters({ ...filters, finalCheckout: e.target.value })
            }
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel>Número de reserva</FormLabel>
            <Input
              placeholder="Filtrar por número de reserva"
              value={filters.reserveNumber}
              onChange={(e) =>
                setFilters({ ...filters, reserveNumber: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel>Número do contrato</FormLabel>
            <Input
              placeholder="Filtrar por número do contrato"
              value={filters.contractNumber}
              onChange={(e) =>
                setFilters({ ...filters, contractNumber: e.target.value })
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
    </>
  );
}
