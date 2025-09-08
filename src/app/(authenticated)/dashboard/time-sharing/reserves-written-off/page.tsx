"use client";
import React, { ChangeEvent, useMemo, useState } from "react";
import { initialFilters } from "./constants";
import { useSearchParams } from "next/navigation";
import { Box, Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import { match, P } from "ts-pattern";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import ReserveWrittenOffFilters from "./_components/ReserveWrittenOffFilters";
import { useGetReservesWrittenOff } from "./hook";
import ReusableDataGrid from "@/components/ReusableDataGrid";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import IconOpenModal from "@/components/IconOpenModal";
import { formatDate } from "@/utils/dates";
import { GridColDef } from "@mui/x-data-grid";

const PAGE_STORAGE_KEY = "ts_reservewithpoints_page";
const ROWS_PER_PAGE_STORAGE_KEY = "ts_reservewithpoints_rows_per_page";

export default function ReservesWrittenOffPage() {
  const [filters, setFilters] = useState(initialFilters);
  const searchParams = useSearchParams();

  const { 
          data, 
          handleFiltersChange, 
          handlePageChange, 
          isLoading, 
          page,
          rowsPerPage,
          setRowsPerPage
      } = useGetReservesWrittenOff();
  const { reservesWrittenOff = [], lastPageNumber } = data ?? {};

  const { action, reserveNumber } = useMemo(() => {
    const action = searchParams.get("action");
    const reserveNumber = searchParams.get("reserveNumber");

    return {
      action,
      reserveNumber,
    };
  }, [searchParams]);

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    handlePageChange(value);
  };

  const handleSearch = () => {
    handleFiltersChange(filters);
  };

  const columns: GridColDef[] = [
    {
      field: 'reserveNumber',
      headerName: 'Reserva',
      width: 150,
      sortable: true,
    },
    {
      field: 'clientName',
      headerName: 'Nome do cliente',
      width: 200,
      sortable: true,
    },
    {
      field: 'contractNumber',
      headerName: 'Número contrato',
      width: 160,
      sortable: true,
    },
    {
      field: 'reserveStatus',
      headerName: 'Status reserva',
      width: 120,
      sortable: true,
    },
    {
      field: 'hotel',
      headerName: 'Hotel',
      width: 120,
      sortable: true,
    },
    {
      field: 'checkin',
      headerName: 'Checkin',
      width: 120,
      sortable: true,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: 'checkout',
      headerName: 'Checkout',
      width: 120,
      sortable: true,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: 'reserveType',
      headerName: 'Tipo de reserva',
      width: 120,
      sortable: true,
    },
    {
      field: 'adults',
      headerName: 'Adultos',
      width: 80,
      sortable: true,
    },
    {
      field: 'children1',
      headerName: 'Crianças 1',
      width: 90,
      sortable: true,
    },
    {
      field: 'children2',
      headerName: 'Crianças 2',
      width: 90,
      sortable: true,
    },
    {
      field: 'actions',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: (params) => (
        <IconOpenModal
          params={{ reserveNumber: params.row.reserveNumber }}
          type="show"
          tooltip="Ver detalhes"
        />
      ),
    },
  ];

  const selectedReserve = useMemo(
    () => {
      const parsedReserveNumber = Number(reserveNumber);
      if (!reserveNumber || isNaN(parsedReserveNumber)) return undefined;
      return reservesWrittenOff.find(
        (reserve) => reserve.reserveNumber == parsedReserveNumber
      );
    },
    [reservesWrittenOff, reserveNumber]
  );

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <ReserveWrittenOffFilters
          filters={filters}
          setFilters={setFilters}
          handleSearch={handleSearch}
        />
        {isLoading ? (
          <LoadingData />
        ) : reservesWrittenOff.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ReusableDataGrid
                rows={reservesWrittenOff}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.reserveNumber}
                pagination={{ enabled: false }}
                responsive={{ enabled: true }}
                toolbar={{ enabled: true }}
                filters={{ enabled: true }}
                export={{ enabled: true }}
                print={{ enabled: true }}
                checkboxSelection={true}
              />
              <ModernPaginatedList
                items={reservesWrittenOff}
                lastPageNumber={lastPageNumber ?? 1}
                handleChangePage={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={(value) => {
                  setRowsPerPage(value);
                  handlePageChange(1);
                }}
                useLocalStorage={true}
                storageKeys={{
                  pageKey: PAGE_STORAGE_KEY,
                  rowsPerPageKey: ROWS_PER_PAGE_STORAGE_KEY,
                }}
              />
            </Stack>
          </>
        )}
      </Stack>
      {match({ action, selectedReserve })
        .with(
          { action: "show", selectedReserve: P.not(undefined) },
          ({ selectedReserve }) => {
            return <ShowDetailsModal shouldOpen={true} reserve={selectedReserve} />;
          }
      )
      .otherwise(() => {
        return null;
      })}
    </>
  );
}
