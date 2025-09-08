"use client";

import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import React from "react";
import { useRouter, usePathname } from "next/navigation"; // Importar useRouter e usePathname
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { initialFilters } from "../../constants";
import FilterByDateInput from "@/components/FilterByDateInput";
import { FiltersProps } from "@/utils/types/user-time-sharing-reserves";

type UserReserveFiltersProps = {
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
  // REMOVEMOS A PROP onGoToCreate
};

export default function UserReserveFilters({
  filters,
  setFilters,
}: UserReserveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname(); // Pega a URL atual, ex: /dashboard/user-time-sharing-reserves

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

  const handleGoToCreate = () => {
    // Navega para a URL atual + /reservar
    router.push(`${pathname}/reservar`);
  };

  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      {/* ... (os Grids dos filtros continuam aqui, sem alteração) ... */}
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
      <Grid xs={12} sm={3}>
        <FormControl>
          <FormLabel>Status reserva</FormLabel>
          <Select value={filters.reserveStatus} onChange={handleChangeStatus}>
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

      <Grid xs={12} sm={3} sx={{ marginTop: "auto" }}>
        <Stack direction="row" spacing={1}>
          <Button
            sx={{
              width: "100%",
              bgcolor: "#2ca2cc",
              fontFamily: "Montserrat, sans-serif",
              color: "white",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#035781",
              },
            }}
            variant="outlined"
            startDecorator={<DeleteIcon />}
            onClick={() => setFilters(initialFilters)}
          >
            Limpar
          </Button>
          <Button
            variant="solid"
            startDecorator={<AddIcon />}
            onClick={handleGoToCreate} // AÇÃO: NAVEGA PARA A NOVA ROTA
            sx={{ width: "100%" }}
          >
            Reservar
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}