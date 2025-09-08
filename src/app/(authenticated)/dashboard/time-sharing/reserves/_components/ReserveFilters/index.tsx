"use client";

import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Checkbox,
  Option,
  Select,
} from "@mui/joy";
import * as React from "react";
import { initialFilters } from "../../constants";
import { FiltersProps } from "@/utils/types/timeSharing/reserves";
import FilterByDateInput from "@/components/FilterByDateInput";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchAndClearFilters from "@/components/SearchAndClearFilters";

type ReserveFiltersProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
  handleSearch: () => void;
};

const FILTERS_STORAGE_KEY = "timesharing_reservations_filters";
const ALL_FILTERS_VISIBLE = "timesharing_reservations_filters_all_visible";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function ReserveFilters({
  filters,
  setFilters,
  handleSearch,
}: ReserveFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false);

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

      React.useEffect(() => {
        if (filters !== initialFilters) {
          handleSearchWithSave();
        }
      });
    
      const handleSearchWithSave = () => {
        if (thereIsLocalStorage)
        {
          localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
          localStorage.setItem(ALL_FILTERS_VISIBLE, showFilters.toString());
        }
        handleSearch();
      };

  const handleChangeStatus = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    newValue: string | null
  ) => {
    setFilters({ ...filters, reserveStatus: newValue });
  };

  return (
    <>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={3}>
          <FormControl>
            <FormLabel>Número de reserva</FormLabel>
            <Input
              placeholder="Filtrar por número de reserva"
              value={filters.reserveNumber}
              onChange={(e) =>
                setFilters({ ...filters, reserveNumber: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={3}>
          <FormControl>
            <FormLabel>Nome do cliente</FormLabel>
            <Input
              placeholder="Filtrar por nome do cliente"
              value={filters.clientName}
              onChange={(e) =>
                setFilters({ ...filters, clientName: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={3}>
          <FormControl>
            <FormLabel>Número do contrato</FormLabel>
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
            <Grid xs={12} sm={3}>
              <FilterByDateInput
                label="Checkin inicial"
                value={filters.initialCheckin}
                onChange={(e) =>
                  setFilters({ ...filters, initialCheckin: e.target.value })
                }
              />
            </Grid>
            <Grid xs={12} sm={3}>
              <FilterByDateInput
                label="Checkin final"
                value={filters.finalCheckin}
                onChange={(e) =>
                  setFilters({ ...filters, finalCheckin: e.target.value })
                }
              />
            </Grid>
            <Grid xs={12} sm={3}>
              <FilterByDateInput
                label="Checkout inicial"
                value={filters.initialCheckout}
                onChange={(e) =>
                  setFilters({ ...filters, initialCheckout: e.target.value })
                }
              />
            </Grid>
            <Grid xs={12} sm={3}>
              <FilterByDateInput
                label="Checkout final"
                value={filters.finalCheckout}
                onChange={(e) =>
                  setFilters({ ...filters, finalCheckout: e.target.value })
                }
              />
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl>
                <FormLabel>Documento do cliente</FormLabel>
                <Input
                  placeholder="Filtrar por documento do cliente"
                  value={filters.clientDocument}
                  onChange={(e) =>
                    setFilters({ ...filters, clientDocument: e.target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl>
                <FormLabel>Hotel</FormLabel>
                <Input
                  placeholder="Filtrar por hotel"
                  value={filters.hotel}
                  onChange={(e) =>
                    setFilters({ ...filters, hotel: e.target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl>
                <FormLabel>Status reserva</FormLabel>
                <Select
                  value={filters.reserveStatus}
                  onChange={handleChangeStatus}
                >
                  <Option value={"A Confirmar"}>A Confirmar</Option>
                  <Option value={"Confirmada"}>Confirmada</Option>
                  <Option value={"Check-In"}>Check-In</Option>
                  <Option value={"Check-Out"}>Check-Out</Option>
                  <Option value={"No-Show"}>No-Show</Option>
                  <Option value={"Cancelada"}>Cancelada</Option>
                  <Option value={"Waiting List"}>Waiting List</Option>
                  <Option value={null}>Selecione o status</Option>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3} sx={{ marginTop: { sm: "35px" } }}>
              <FormControl>
                <Checkbox
                  checked={filters.showAllHosts}
                  label="Mostrar todos os hóspedes"
                  onChange={(e) =>
                    setFilters({ ...filters, showAllHosts: e.target.checked })
                  }
                />
              </FormControl>
            </Grid>
            <SearchAndClearFilters
              handleSearch={handleSearchWithSave}
              handleClear={() => {
                setFilters(initialFilters);
                if (thereIsLocalStorage) localStorage.removeItem(FILTERS_STORAGE_KEY);
              }}
            />
          </>
        ) : (
          <SearchAndClearFilters
            handleSearch={handleSearchWithSave}
            handleClear={() => {
                setFilters(initialFilters);
                if (thereIsLocalStorage) localStorage.removeItem(FILTERS_STORAGE_KEY);
              }}
          />
        )}
        <Grid xs={12} md={2} sx={{ marginTop: "auto" }}>
          <Button
            sx={{
              minWidth: "150px",
              bgcolor: "#2ca2cc",
              fontFamily: "Montserrat, sans-serif",
              color: "white",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#035781",
              },
            }}
            variant="outlined"
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
