"use client";

import * as React from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Grid,
  Input,
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
  const setStatus = (value: string) => {
    setFilters({ ...filters, status: value });
  };

  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={2}>
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

        <Grid xs={12} sm={2}>
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

        <Grid xs={12} sm={6}>
          <FormControl>
            <FormLabel
              color={undefined}
              sx={{
                color: "var(--color-secondary) !important",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Status da conta
            </FormLabel>
            <ButtonGroup sx={{ display: "flex", flexWrap: "nowrap", gap: 1, width: "100%", overflowX: { xs: "auto", sm: "visible" } }}>
              <Button
                variant={filters.status === "T" ? "solid" : "outlined"}
                color={filters.status === "T" ? "primary" : "neutral"}
                onClick={() => setStatus("T")}
                sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500, minWidth: 100 }}
              >
                Todas as contas
              </Button>
              <Button
                variant={filters.status === "P" ? "solid" : "outlined"}
                color={filters.status === "P" ? "primary" : "neutral"}
                onClick={() => setStatus("P")}
                sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500, minWidth: 100 }}
              >
                Em aberto
              </Button>
              <Button
                variant={filters.status === "V" ? "solid" : "outlined"}
                color={filters.status === "V" ? "primary" : "neutral"}
                onClick={() => setStatus("V")}
                sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500, minWidth: 100 }}
              >
                Vencidas
              </Button>
              <Button
                variant={filters.status === "B" ? "solid" : "outlined"}
                color={filters.status === "B" ? "primary" : "neutral"}
                onClick={() => setStatus("B")}
                sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500, minWidth: 100 }}
              >
                Pagas
              </Button>
            </ButtonGroup>
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
              transition: "0.6s",
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
