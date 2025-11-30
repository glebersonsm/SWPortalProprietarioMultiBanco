"use client";

import { Button, FormControl, FormLabel, Grid, Input,Option, Select  } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import { FiltersProps } from "@/utils/types/multiownership/owners";
import { initialFilters } from "../../constants";
import FilterByDateInput from "@/components/FilterByDateInput";
import { useQuery } from "@tanstack/react-query";
import { getEmpresasVinculadas } from "@/services/querys/framework";
import { useEffect, useState } from "react";

type MultiownershipOwnerFilterProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
};

const FILTERS_STORAGE_KEY = "owners_filters";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function MultiownershipOwnerFilters({
  filters,
  setFilters,
}: MultiownershipOwnerFilterProps) {
  const { data } = useQuery({
    queryKey: ["GetEmpresasVinculadas"],
    queryFn: () => getEmpresasVinculadas(),
  });

    function handleContractSignedChangeSent(
      event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | React.FocusEvent<Element, Element> | null,
      value: string | null
    ): void {
      setFilters({ ...filters, contractSigned: value ?? "T" });
    }
  

  const [isFiltersLoaded, setIsFiltersLoaded] = useState(false);

  useEffect(() => {
    const savedFilters = thereIsLocalStorage ? localStorage.getItem(FILTERS_STORAGE_KEY) : "";

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
        setFilters(initialFilters);
      }
    } else {
      setFilters(initialFilters);
    }

    setIsFiltersLoaded(true);
  }, [setFilters]);

  useEffect(() => {
    if (isFiltersLoaded && thereIsLocalStorage) {
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
              Empresa
            </FormLabel>
            <Select
              value={filters.companyId}
              onChange={(event, value) =>
                setFilters({ ...filters, companyId: Number(value ?? -1) })
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
                <Option value={Number(item.id)} key={item.id}>
                  {String(item.id)} - {item.nome}
                </Option>
              ))}
            </Select>
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
              Número Contrato
            </FormLabel>
            <Input
              placeholder="Filtrar por contrato"
              value={filters.contractNumber}
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
                setFilters({ ...filters, contractNumber: e.target.value })
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
              Nome
            </FormLabel>
            <Input
              placeholder="Filtrar por nome"
              value={filters.clientName}
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
                setFilters({ ...filters, clientName: e.target.value })
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
              Imóvel
            </FormLabel>
            <Input
              placeholder="Filtrar pelo imóvel"
              value={filters.unitNumber}
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
                setFilters({ ...filters, unitNumber: e.target.value })
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
              Fração
            </FormLabel>
            <Input
              placeholder="Filtrar pela fração"
              value={filters.quotaFraction}
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
                setFilters({ ...filters, quotaFraction: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={2}>
          <FilterByDateInput
            label="Data aquisição inicial"
            value={filters.purchaseDateInitial}
            colorLabel="primary.solidHoverBg"
            onChange={(e) =>
              setFilters({ ...filters, purchaseDateInitial: e.target.value })
            }
          />
        </Grid>
        <Grid xs={12} sm={3}>
          <FilterByDateInput
            label="Data aquisição final"
            colorLabel="primary.solidHoverBg"
            value={filters.purchaseDateFinal}
            onChange={(e) =>
              setFilters({ ...filters, purchaseDateFinal: e.target.value })
            }
          />
        </Grid>
        <Grid xs={12} sm={3}>
              <FormControl>
                <FormLabel sx={{
                  color: "primary.solidHoverBg",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 500,
                }}>Status assinatura contrato SCP</FormLabel>
                <Select value={filters.contractSigned} 
                  onChange={handleContractSignedChangeSent}
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
                    }}>
                  <Option value="T">Todos</Option>
                  <Option value="S">Apenas que assinaram contrato com a SCP</Option>
                  <Option value="N">Apenas que não assinaram contrato com a SCP</Option>
                </Select>
              </FormControl>
          </Grid>

        <Grid xs={12} sm={2} sx={{ marginTop: "auto" }}>
          <Button
            sx={{
              width: "100%",
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
            onClick={() => {
              if (thereIsLocalStorage) localStorage.removeItem(FILTERS_STORAGE_KEY);
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
