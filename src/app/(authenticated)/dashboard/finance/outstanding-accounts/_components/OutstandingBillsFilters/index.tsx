"use client";

import { FormControl, FormLabel, Grid, Input, Option, Select, Button, ButtonGroup } from "@mui/joy";
import { FiltersOutstandingBills } from "@/utils/types/finance";
import { initialFilters } from "@/app/(authenticated)/dashboard/finance/outstanding-accounts/constants";
import SearchAndClearFilters from "@/components/SearchAndClearFilters";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEmpresasVinculadas } from "@/services/querys/framework";

type OutstandingBillsFiltersProps = {
  filters: FiltersOutstandingBills;
  setFilters: React.Dispatch<React.SetStateAction<FiltersOutstandingBills>>;
  handleSearch: () => void;
};

const FILTERS_STORAGE_KEY = "outstandingBils_filters";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function OutstandingBillsFilters({
  filters,
  setFilters,
  handleSearch,
}: OutstandingBillsFiltersProps) {
  const { data } = useQuery({
    queryKey: ["GetEmpresasVinculadas"],
    queryFn: () => getEmpresasVinculadas(),
  });

  useEffect(() => {
    const savedFilters = thereIsLocalStorage ? localStorage.getItem(FILTERS_STORAGE_KEY) : null;

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
  }, [setFilters]);

  const handleSearchWithSave = () => {
    if (thereIsLocalStorage)
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    handleSearch();
  };

  const setStatus = (value: string) => {
    setFilters({ ...filters, status: value });
  };

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
              Empresa
            </FormLabel>
            <Select
              value={filters.companyId}
              onChange={(event, value) =>
                setFilters({ ...filters, companyId: value ?? -1 })
              }
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
            >
              <Option value={-1}>Todas</Option>
              {data?.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.nome}
                </Option>
              ))}
            </Select>
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
              Nome do cliente
            </FormLabel>
            <Input
              placeholder="Filtrar nome do cliente"
              value={filters.personName}
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
              onChange={(e) =>
                setFilters({ ...filters, personName: e.target.value })
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
              onChange={(e) =>
                setFilters({ ...filters, initialDueDate: e.target.value })
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
              onChange={(e) =>
                setFilters({ ...filters, finalDueDate: e.target.value })
              }
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
              Status da conta
            </FormLabel>
            <ButtonGroup sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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

        <SearchAndClearFilters
          handleSearch={handleSearchWithSave}
          handleClear={() => {
            setFilters(initialFilters);
            if (thereIsLocalStorage) localStorage.removeItem(FILTERS_STORAGE_KEY);
          }}
          gridSize={3}
        />
      </Grid>
    </>
  );
}