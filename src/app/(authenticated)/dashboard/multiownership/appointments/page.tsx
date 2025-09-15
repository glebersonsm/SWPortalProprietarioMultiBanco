"use client";
import React, { ChangeEvent, useMemo, useState } from "react";
import { initialFilters } from "./constants";
import { Box, Divider, Stack, IconButton, Tooltip } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import MultiOwnershipAppointmentFilters from "./_components/MultiOwnershipAppointmentFilters";
import { useGetAppointments } from "./hook";
import { useSearchParams, useRouter } from "next/navigation";
import { match, P } from "ts-pattern";
import ReleasePoolModal from "./_components/ReleasePoolModal";
import RemovePoolModal from "./_components/RemovePoolModal";
import AppointmentHistoryModal from "./_components/ListAppointments/AppointmentHistoryModal";
import ReusableDataGrid from "@/components/ReusableDataGrid";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { formatWithSaturdayFormCheck } from "@/utils/dates";
import { Visibility, Cancel, Refresh, History } from "@mui/icons-material";
import { AppointmentMultiOwnership } from "@/utils/types/multiownership/appointments";
import { addDays } from "date-fns";

export default function AppointmentsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { 
        data,
        rowsPerPage,
        isLoading,
        page,
        handleFiltersChange,
        handlePageChange,
        setRowsPerPage 
        } = useGetAppointments();

  const { appointments = [], lastPageNumber } = data ?? {};

  const { action, appointmentId } = useMemo(() => {
  const action = searchParams.get("action");
  const appointmentId = searchParams.get("appointmentId");

    return {
      action,
      appointmentId,
    };
  }, [searchParams]);

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    handlePageChange(value);
  };

  const handleSearch = () => {
    handleFiltersChange(filters);
  };

  const selectedAppointment = useMemo(
    () =>
      appointments.find(
        (appointment: { id: number }) => appointment.id === Number(appointmentId) ),
    [appointments, appointmentId]
  );

  const openModal = (action: string, appointmentId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('action', action);
    params.set('appointmentId', appointmentId.toString());
    router.push(`?${params.toString()}`);
  };

  const columns: GridColDef[] = [
    {
      field: 'periodCoteAvailabilityId',
      headerName: 'Id',
      width: 80,
      type: 'number',
    },
    {
      field: 'year',
      headerName: 'Ano',
      width: 100,
    },
    {
      field: 'ownershipName',
      headerName: 'Cliente',
      width: 200,
      flex: 1,
    },
    {
      field: 'initialDate',
      headerName: 'Data inicial',
      width: 120,
      valueFormatter: (params: string) => formatWithSaturdayFormCheck(params, 'dd/MM/yyyy'),
    },
    {
      field: 'finalDate',
      headerName: 'Data final',
      width: 120,
      valueFormatter: (params: string) => formatWithSaturdayFormCheck(params, 'dd/MM/yyyy'),
    },
    {
      field: 'weekType',
      headerName: 'Tipo',
      width: 120,
    },
    {
      field: 'coteName',
      headerName: 'Nome da cota',
      width: 200,
      flex: 1,
    },
    {
      field: 'roomNumber',
      headerName: 'Imóvel',
      width: 70,
    },
    {
      field: 'availableTypeName',
      headerName: 'Tipo disponib.',
      width: 100,
    },
    {
      field: 'reservations',
      headerName: 'Reservas vinculadas',
      width: 200,
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 150,
      getActions: (params) => {
        const appointment = params.row as AppointmentMultiOwnership;
        const actions = [];

        // Visualizar reservas
        if (appointment.bookings && appointment.bookings.length > 0) {
          actions.push(
            <GridActionsCellItem
              key="view"
              icon={
                <Tooltip title="Visualizar reserva(s)">
                  <Visibility />
                </Tooltip>
              }
              label="Visualizar reserva(s)"
              onClick={() => router.push(`/dashboard/multiownership/appointments/${appointment.id}/bookings`)}
            />
          );
        }

        // Retirar do pool
        if (appointment.canRemovePool && !appointment.canReleasePool && 
          new Date(appointment.initialDate) > addDays(new Date(),180)) {
          actions.push(
            <GridActionsCellItem
              key="remove-pool"
              icon={
                <Tooltip title="Retirar do pool">
                  <Cancel />
                </Tooltip>
              }
              label="Retirar do pool"
              onClick={() => openModal('cancel', appointment.id)}
            />
          );
        }

        // Liberar para pool
        if (!appointment.canRemovePool && appointment.canReleasePool && new Date(appointment.initialDate) > new Date() && appointment.availableTypeName.includes("USO")) {
          actions.push(
            <GridActionsCellItem
              key="release-pool"
              icon={
                <Tooltip title="Liberar para pool">
                  <Refresh />
                </Tooltip>
              }
              label="Liberar para pool"
              onClick={() => openModal('reset', appointment.id)}
            />
          );
        }

        // Visualizar histórico
        actions.push(
          <GridActionsCellItem
            key="history"
            icon={
              <Tooltip title="Visualizar históricos">
                <History />
              </Tooltip>
            }
            label="Visualizar históricos"
            onClick={() => openModal('history', appointment.id)}
          />
        );

        return actions;
      },
    },
  ];

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <MultiOwnershipAppointmentFilters
          filters={filters}
          setFilters={setFilters}
          handleSearch={handleSearch}
        />
        {isLoading ? (
          <LoadingData />
        ) : appointments.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ReusableDataGrid
                rows={appointments}
                columns={columns}
                getRowId={(row) => row.id}
                toolbar={{
                enabled: true,
                title: "Agendamentos",
                showQuickFilter: true,
                showColumnsButton: true,
                showFiltersButton: true,
                showDensitySelector: true,
                showExportButton: true,
                showPrintButton: true,
              }}
              filters={{
                enabled: true,
                quickFilter: true,
                columnFilters: true,
              }}
              export={{
                enabled: true,
                filename: "agendamentos",
                buttonText: "Exportar CSV",
              }}
              print={{
                enabled: true,
                buttonText: "Imprimir",
              }}
              pagination={{
                enabled: false,
                useLocalStorage: true,
              }}
              />
              <Box alignSelf="flex-end" marginTop="8px">
                <ModernPaginatedList
                  items={appointments}
                  lastPageNumber={lastPageNumber ?? 1}
                  handleChangePage={handleChangePage}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={(value) => {
                    setRowsPerPage(value as number);
                    handlePageChange(1);
                  }}
                />
              </Box>
            </Stack>
          </>
        )}
      </Stack>
      {match({ action, selectedAppointment })
        .with(
          { action: "reset", selectedAppointment: P.not(undefined) },
          ({ selectedAppointment }) => (
            <ReleasePoolModal
              shouldOpen={true}
              appointmentId={selectedAppointment.id}
            />
          )
        )
        .with(
          { action: "cancel", selectedAppointment: P.not(undefined) },
          ({ selectedAppointment }) => (
            <RemovePoolModal
              shouldOpen={true}
              appointmentId={selectedAppointment.id}
            />
          )
        )
        .with(
          {
            action: "history",
            selectedAppointment: P.not(undefined),
          },
          ({ selectedAppointment }) => (
            <AppointmentHistoryModal 
             shouldOpen={true} 
             appointmentId={selectedAppointment.id} 
            />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
