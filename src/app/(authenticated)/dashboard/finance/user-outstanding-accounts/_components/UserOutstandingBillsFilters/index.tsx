"use client";

import * as React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
} from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import { initialFilters } from "../../constants";
import { FiltersUserOutstandingBills } from "@/utils/types/finance-users";

type UserOutstandingBillsFiltersProps = {
  filters: FiltersUserOutstandingBills;
  setFilters: React.Dispatch<React.SetStateAction<FiltersUserOutstandingBills>>;
};

export default function UserOutstandingBillsFilters({
  filters,
  setFilters,
}: UserOutstandingBillsFiltersProps) {
  function handlePaymentStatusChangeSent(
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    value: string | null
  ): void {
    setFilters({ ...filters, status: value });
  }

  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={3}>
          <FormControl>
            <FormLabel
              color={undefined}
              sx={{
                color: "var(--color-secondary) !important",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Vencimento Inicial
            </FormLabel>
            <Input
              placeholder="Filtrar por data inicial de vencimento"
              value={filters.initialDueDate}
              type="date"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                color: "text.primary",
              }}
              onChange={(e) =>
                setFilters({ ...filters, initialDueDate: e.target.value })
              }
            />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={3}>
          <FormControl>
            <FormLabel
              color={undefined}
              sx={{
                color: "var(--color-secondary) !important",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Vencimento Final
            </FormLabel>
            <Input
              placeholder="Filtrar por data final de vencimento"
              value={filters.finalDueDate}
              type="date"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                color: "text.primary",
              }}
              onChange={(e) =>
                setFilters({ ...filters, finalDueDate: e.target.value })
              }
            />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={3}>
          <FormControl>
            <FormLabel
              color={undefined}
              sx={{
                color: "var(--color-secondary) !important",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Status
            </FormLabel>
            <Select
              value={filters.status}
              onChange={handlePaymentStatusChangeSent}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              <Option value="T">Todos</Option>
              <Option value="P">Em aberto</Option>
              <Option value="V">Vencidas</Option>
              <Option value="B">Pagas</Option>
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={12} sm={3} sx={{ marginTop: "auto" }}>
          <Button
            sx={{
              width: "100%",
              bgcolor: "var(--color-button-primary)",
              color: "var(--color-button-text)",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              border: "none",
              transition: "0.6s",
              "&:hover": {
                bgcolor: "var(--color-button-primary-hover)",
              },
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
