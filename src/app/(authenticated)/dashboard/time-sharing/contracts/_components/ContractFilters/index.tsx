"use client";

import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
} from "@mui/joy";
import * as React from "react";
import { initialFilters } from "../../constants";
import { FiltersProps } from "@/utils/types/timeSharing/contracts";
import FilterByDateInput from "@/components/FilterByDateInput";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchAndClearFilters from "@/components/SearchAndClearFilters";

type ContractFilterProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
  handleSearch: () => void;
};


const FILTERS_STORAGE_KEY = "ts_contracts_filters";
const ALL_FILTERS_VISIBLE = "ts_contracts_filters_all_visible";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function ContractFilters({
  filters,
  setFilters,
  handleSearch,
}: ContractFilterProps) {
  const [showFilters, setShowFilters] = React.useState(false);

  const handleChangeStatus = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    newValue: string | null
  ) => {
    setFilters({ ...filters, status: newValue });
  };

  React.useEffect(() => {
         const savedFilters = thereIsLocalStorage ? localStorage.getItem(FILTERS_STORAGE_KEY) : "";
         const savedAllFiltersVisible = thereIsLocalStorage ? localStorage.getItem(ALL_FILTERS_VISIBLE) : "";
    
         if (savedAllFiltersVisible === "true") {
           setShowFilters(true);
         }
    
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
      {
          localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
          localStorage.setItem(ALL_FILTERS_VISIBLE, showFilters.toString());
      }
    handleSearch();
  };

  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={showFilters ? 4 : 3}>
          <FormControl>
            <FormLabel>Id venda</FormLabel>
            <Input
              placeholder="Filtrar por id"
              value={filters.tsSaleId}
              onChange={(e) =>
                setFilters({ ...filters, tsSaleId: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={showFilters ? 4 : 3}>
          <FormControl>
            <FormLabel>Nome cliente</FormLabel>
            <Input
              placeholder="Filtrar nome do cliente"
              value={filters.clientName}
              onChange={(e) =>
                setFilters({ ...filters, clientName: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={showFilters ? 4 : 3}>
          <FormControl>
            <FormLabel>Número contrato</FormLabel>
            <Input
              placeholder="Filtrar por número do contrato"
              value={filters.contractNumber}
              onChange={(e) =>
                setFilters({ ...filters, contractNumber: e.target.value })
              }
            />
          </FormControl>
        </Grid>

        {showFilters ? (
          <>
            <Grid xs={12} sm={4}>
              <FilterByDateInput
                label="Data venda inicial"
                value={filters.initialSaleDate}
                onChange={(e) =>
                  setFilters({ ...filters, initialSaleDate: e.target.value })
                }
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <FilterByDateInput
                label="Data venda final"
                value={filters.finalSaleDate}
                onChange={(e) =>
                  setFilters({ ...filters, finalSaleDate: e.target.value })
                }
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <FilterByDateInput
                label="Data cancelamento inicial"
                value={filters.initialCancellationDate}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    initialCancellationDate: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <FilterByDateInput
                label="Data cancelamento final"
                value={filters.finalCancellationDate}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    finalCancellationDate: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl>
                <FormLabel>Documento cliente</FormLabel>
                <Input
                  placeholder="Filtrar por documento do cliente"
                  value={filters.clientDocument}
                  onChange={(e) =>
                    setFilters({ ...filters, clientDocument: e.target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl>
                <FormLabel>Tipo contrato</FormLabel>
                <Input
                  placeholder="Filtrar por tipo de contrato"
                  value={filters.contractType}
                  onChange={(e) =>
                    setFilters({ ...filters, contractType: e.target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl>
                <FormLabel>Projeto-contrato</FormLabel>
                <Input
                  placeholder="Filtrar por projeto-contrato"
                  value={filters.projectXContract}
                  onChange={(e) =>
                    setFilters({ ...filters, projectXContract: e.target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl>
                <FormLabel>Sala de vendas</FormLabel>
                <Input
                  placeholder="Filtrar por sala de vendas"
                  value={filters.saleRoom}
                  onChange={(e) =>
                    setFilters({ ...filters, saleRoom: e.target.value })
                  }
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={3}>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select value={filters.status} onChange={handleChangeStatus}>
                  <Option value="ATIVO">Ativo</Option>
                  <Option value="CANCELADO">Cancelado</Option>
                  <Option value="EXPIRADO">Expirado</Option>
                  <Option value="REVERTIDO">Revertido</Option>
                  <Option value={null}>Selecione o status</Option>
                </Select>
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
          </>
        ) : (
          <SearchAndClearFilters
            handleSearch={handleSearchWithSave}
            handleClear={() => {
              setFilters(initialFilters);
              if (thereIsLocalStorage) localStorage.removeItem(FILTERS_STORAGE_KEY);
            }}
            gridSize={3}
          />
        )}
        <Grid xs={12} md={2} sx={{ marginTop: "auto" }}>
          <Button
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
            onClick={() => setShowFilters(!showFilters)}
            fullWidth
          >
            {showFilters ? "Menos filtros" : "Mais filtros"}
            {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
