"use client";

import { FormControl, FormLabel, Grid, Input, Checkbox } from "@mui/joy";
import * as React from "react";
import { initialFilters } from "../../constants";
import { FiltersProps } from "@/utils/types/user-reservesMultiOwnership";
import SearchAndClearFilters from "@/components/SearchAndClearFilters";

const FILTERS_STORAGE_KEY = "users_multiownership_appointment_filters";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

type MultiOwnershipAppointmentFiltersProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
  handleSearch: () => void;
};

export default function MultiOwnershipAppointmentFilters({
  filters,
  setFilters,
  handleSearch,
}: MultiOwnershipAppointmentFiltersProps) {
  const [isFiltersLoaded, setIsFiltersLoaded] = React.useState(false);

  React.useEffect(() => {
      const savedFilters = thereIsLocalStorage ? localStorage.getItem(FILTERS_STORAGE_KEY) : "";
  
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters);
          if (parsedFilters && JSON.stringify(parsedFilters) !== JSON.stringify(initialFilters)) {
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
      if (isFiltersLoaded && thereIsLocalStorage) {
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
      }
    }, [filters, isFiltersLoaded]);

  React.useEffect(() => {
    handleSearch();
  }, [filters, handleSearch]);

  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid xs={12} sm={3}>
        <FormControl>
          <FormLabel>Ano (AAAA)</FormLabel>
          <Input
            type="number"
            placeholder="Filtrar pelo ano do agendamento"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          />
        </FormControl>
      </Grid>
      <Grid xs={12} sm={3} marginTop={"30px"}>
        <FormControl>
          <Checkbox
            checked={filters.withoutReservation}
            label="Somente pendente de reservas"
            onChange={(e) =>
              setFilters({ ...filters, withoutReservation: e.target.checked })
            }
          />
        </FormControl>
      </Grid>
      <SearchAndClearFilters
        handleSearch={handleSearch}
        handleClear={() => {
          if (thereIsLocalStorage)
            localStorage.removeItem(FILTERS_STORAGE_KEY);
          setFilters(initialFilters);
        }}
        showUpdateButton={false}
      />
    </Grid>
  );
}
