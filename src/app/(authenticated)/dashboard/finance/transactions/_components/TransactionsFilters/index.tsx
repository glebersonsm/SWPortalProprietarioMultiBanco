"use client";

import * as React from "react";
import { FormControl, FormLabel, Grid, Input, Option, Select } from "@mui/joy";
import { FiltersTransactions } from "@/utils/types/finance";
import { initialFilters } from "../../constants";
import SearchAndClearFilters from "@/components/SearchAndClearFilters";
import { getEmpresasVinculadas } from "@/services/querys/framework";
import { useQuery } from "@tanstack/react-query";

const FILTERS_STORAGE_KEY = "transactions_filters";
const ALL_FILTERS_VISIBLE = "transactions_filters_all_visible";
const thereIdLocalStorage = typeof window != "undefined" && window.localStorage;

type TransactionsFiltersProps = {
  filters: FiltersTransactions;
  setFilters: React.Dispatch<React.SetStateAction<FiltersTransactions>>;
  handleSearch: () => void;
};

export default function TransactionsFilters({
  filters,
  setFilters,
  handleSearch,
}: TransactionsFiltersProps) {

const { data } = useQuery({
    queryKey: ["GetEmpresasVinculadas"],
    queryFn: () => getEmpresasVinculadas(),
  });

React.useEffect(() => {
    const savedFilters = thereIdLocalStorage ? localStorage.getItem(FILTERS_STORAGE_KEY) : "";
    const savedAllFiltersVisible = thereIdLocalStorage ? localStorage.getItem(ALL_FILTERS_VISIBLE) : "";
 
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        if (parsedFilters && JSON.stringify(parsedFilters) !== JSON.stringify(initialFilters)) {
          setFilters(parsedFilters);
        }
      } catch (error) {
        setFilters(initialFilters);
      }
    } else {
      setFilters(initialFilters);
    }
  }, [setFilters]);


  const handleChangeSent = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    newValue: string | null
  ) => {
    setFilters({ ...filters, paymentType: newValue });
  };

  const handlePaymentStatusChangeSent = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    pstatusnew: string | null
  ) => {
    setFilters({ ...filters, paymentStatus: pstatusnew });
  };
  
  const handleSearchWithSave = () => {
    if (thereIdLocalStorage)
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    handleSearch();
  };

  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={4}>
            <FormControl>
              <FormLabel>
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
        <Grid xs={12} sm={5}>
          <FormControl>
            <FormLabel>Nome do cliente</FormLabel>
            <Input
              placeholder="Filtrar do cliente"
              value={filters.personName}
              onChange={(e) =>
                setFilters({ ...filters, personName: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={2}>
          <FormControl>
            <FormLabel>Tipo de pagamento</FormLabel>
            <Select value={filters.paymentType} onChange={handleChangeSent}>
              <Option value="pix">Pix</Option>
              <Option value="card">Cartão</Option>
              <Option value="default">Selecione</Option>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={3}>
          <FormControl>
            <FormLabel>Status transação</FormLabel>
            <Select value={filters.paymentStatus} onChange={handlePaymentStatusChangeSent}>
              <Option value="captured">Autorizada</Option>
              <Option value="cancelled">Cancelada</Option>
              <Option value="pending">Pendente</Option>
              <Option value="notpaid">Não paga</Option>
              <Option value="default">Selecione</Option>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={2}>
          <FormControl>
            <FormLabel>Data inicial</FormLabel>
            <Input
              type="date"
              value={filters.initialDate}
              onChange={(e) =>
                setFilters({ ...filters, initialDate: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={2}>
          <FormControl>
            <FormLabel>Data final</FormLabel>
            <Input
              type="date"
              value={filters.finalDate}
              onChange={(e) =>
                setFilters({ ...filters, finalDate: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <SearchAndClearFilters
          handleSearch={handleSearchWithSave}
          handleClear={() => {
            setFilters(initialFilters);
            localStorage.removeItem(FILTERS_STORAGE_KEY);
          }}
          gridSize={2}
        />
      </Grid>
    </>
  );
}
