"use client";

import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
} from "@mui/joy";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { initialFilters } from "../../constants";
import { FiltersProps } from "@/utils/types/user-time-sharing-contracts";

type UserContractFilterProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
  handleSearch?: () => void;
};

export default function UserContractFilters({
  filters,
  setFilters,
  handleSearch,
}: UserContractFilterProps) {

  const handleClearFilters = () => {
    setFilters(initialFilters);
    if (handleSearch) {
      handleSearch();
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems="flex-end"
      >
        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel>Número do contrato</FormLabel>
            <Input
              placeholder="Filtrar por número do contrato"
              value={filters.contractNumber}
              onChange={(e) =>
                setFilters({ ...filters, contractNumber: e.target.value })
              }
              size="md"
            />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={4}>
          <Button
            size="md"
            sx={{
              minWidth: "150px",
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
            onClick={handleClearFilters}
          >
            Limpar Filtros
          </Button>
        </Grid>

      </Grid>
    </>
  );
}