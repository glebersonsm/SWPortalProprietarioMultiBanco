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
        <Grid xs={12} sm={6} md={3} lg={2}>
          <FormControl sx={{ width: '100%' }}>
            <FormLabel
              color={undefined}
              sx={{
                color: "var(--color-secondary) !important",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
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
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
              onChange={(e) =>
                setFilters({ ...filters, initialDueDate: e.target.value })
              }
            />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={6} md={3} lg={2}>
          <FormControl sx={{ width: '100%' }}>
            <FormLabel
              color={undefined}
              sx={{
                color: "var(--color-secondary) !important",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
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
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
              onChange={(e) =>
                setFilters({ ...filters, finalDueDate: e.target.value })
              }
            />
          </FormControl>
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <FormControl sx={{ width: '100%' }}>
            <FormLabel
              color={undefined}
              sx={{
                color: "var(--color-secondary) !important",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Status da conta
            </FormLabel>
            <ButtonGroup 
              sx={{ 
                display: "flex", 
                flexWrap: { xs: "wrap", sm: "nowrap" }, 
                gap: { xs: 1, sm: 1 }, 
                width: "100%",
                '& > button': {
                  flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 auto' },
                  minWidth: { xs: 'calc(50% - 8px)', sm: 100 },
                }
              }}
            >
              <Button
                variant={filters.status === "T" ? "solid" : "outlined"}
                color={filters.status === "T" ? "primary" : "neutral"}
                onClick={() => setStatus("T")}
                sx={{ 
                  fontFamily: "Montserrat, sans-serif", 
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                }}
              >
                Todas
              </Button>
              <Button
                variant={filters.status === "P" ? "solid" : "outlined"}
                color={filters.status === "P" ? "primary" : "neutral"}
                onClick={() => setStatus("P")}
                sx={{ 
                  fontFamily: "Montserrat, sans-serif", 
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                }}
              >
                Em aberto
              </Button>
              <Button
                variant={filters.status === "V" ? "solid" : "outlined"}
                color={filters.status === "V" ? "primary" : "neutral"}
                onClick={() => setStatus("V")}
                sx={{ 
                  fontFamily: "Montserrat, sans-serif", 
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                }}
              >
                Vencidas
              </Button>
              <Button
                variant={filters.status === "B" ? "solid" : "outlined"}
                color={filters.status === "B" ? "primary" : "neutral"}
                onClick={() => setStatus("B")}
                sx={{ 
                  fontFamily: "Montserrat, sans-serif", 
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                }}
              >
                Pagas
              </Button>
            </ButtonGroup>
          </FormControl>
        </Grid>

        <Grid xs={12} md={12} lg={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button
            sx={{
              width: "100%",
              bgcolor: "var(--color-button-primary)",
              color: "var(--color-button-text)",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              border: "none",
              transition: "0.6s",
              py: { xs: 1, sm: 1.25 },
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
