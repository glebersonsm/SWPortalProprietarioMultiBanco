"use client";

import { Button, FormControl, FormLabel, Grid, Input } from "@mui/joy";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { FiltersProps } from "@/utils/types/users";
import { initialFilters } from "../../constants";

type UserFiltersProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
};

const FILTERS_STORAGE_KEY = "users_filters";

export default function UserFilters({ filters, setFilters }: UserFiltersProps) {
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
        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel
              sx={{
                color: "primary.solidHoverBg",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Nome/Login
            </FormLabel>
            <Input
              placeholder="Filtrar por nome do usuário"
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
                  borderColor: "var(--users-filter-hover-border)",
                },
                "&.Mui-focused": {
                  borderColor: "var(--users-filter-border-color)",
                  boxShadow: "0 0 0 2px var(--users-filter-focus-shadow)",
                },
                "&.Mui-error": {
                  borderColor: "danger.500",
                },
              }}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={1}>
          <FormControl>
            <FormLabel
              sx={{
                color: "primary.solidHoverBg",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              ID
            </FormLabel>
            <Input
              placeholder="Filtrar por id"
              value={filters.id}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                color: "text.primary",
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 0.6,
                },
                "&:hover": {
                  borderColor: "var(--users-filter-hover-border)",
                },
                "&.Mui-focused": {
                  borderColor: "var(--users-filter-border-color)",
                  boxShadow: "0 0 0 2px var(--users-filter-focus-shadow)",
                },
                "&.Mui-error": {
                  borderColor: "danger.500",
                },
              }}
              onChange={(e) => setFilters({ ...filters, id: e.target.value })}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={3}>
          <FormControl>
            <FormLabel
              sx={{
                color: "primary.solidHoverBg",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              Email
            </FormLabel>
            <Input
              placeholder="Filtrar por email do usuário"
              value={filters.email}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                color: "text.primary",
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 0.6,
                },
                "&:hover": {
                  borderColor: "var(--users-filter-hover-border)",
                },
                "&.Mui-focused": {
                  borderColor: "var(--users-filter-border-color)",
                  boxShadow: "0 0 0 2px var(--users-filter-focus-shadow)",
                },
                "&.Mui-error": {
                  borderColor: "danger.500",
                },
              }}
              onChange={(e) =>
                setFilters({ ...filters, email: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={2}>
          <FormControl>
            <FormLabel
              sx={{
                color: "primary.solidHoverBg",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
              }}
            >
              CPF/CNPJ
            </FormLabel>
            <Input
              placeholder="Filtrar por CPF do usuário"
              value={filters.cpf}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                color: "text.primary",
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 0.6,
                },
                "&:hover": {
                  borderColor: "var(--users-filter-hover-border)",
                },
                "&.Mui-focused": {
                  borderColor: "var(--users-filter-border-color)",
                  boxShadow: "0 0 0 2px var(--users-filter-focus-shadow)",
                },
                "&.Mui-error": {
                  borderColor: "danger.500",
                },
              }}
              onChange={(e) => setFilters({ ...filters, cpf: e.target.value })}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={2} sx={{ marginTop: "auto" }}>
          <Button
            sx={{
              width: "100%",
              bgcolor: "var(--users-button-clear-bg)",
              fontFamily: "Montserrat, sans-serif",
              color: "white",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "var(--users-button-clear-hover)",
              },
            }}
            variant="outlined"
            endDecorator={<DeleteIcon />}
            onClick={() => {
              localStorage.removeItem(FILTERS_STORAGE_KEY);
              setFilters(initialFilters);
            }}
          >
            Limpar Filtros
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
