"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import { initialFilters } from "./constants";
import { useSearchParams } from "next/navigation";
import { Box, Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import ReusableDataGrid from "@/components/ReusableDataGrid";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import { GridColDef } from "@mui/x-data-grid";
import { match, P } from "ts-pattern";
import ContractFilters from "./_components/ContractFilters";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import { useGetContracts } from "./hook";
import IconOpenModal from "@/components/IconOpenModal";

const PAGE_STORAGE_KEY = "contracts_ts_page";
const ROWS_PER_PAGE_STORAGE_KEY = "contracts_ts_rows_per_page";

export default function ContractsPage() {
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
  } = useGetContracts();

  const { contracts = [], lastPageNumber } = data ?? {};

  const { action, tsSaleId } = useMemo(() => {
    const action = searchParams.get("action");
    const tsSaleId = searchParams.get("tsSaleId");

    return {
      action,
      tsSaleId,
    };
  }, [searchParams]);

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    handlePageChange(value);
  };

  const handleSearch = () => {
    handleFiltersChange(filters);
  };

  const selectedContract = useMemo(
    () => contracts.find((contract) => contract.tsSaleId === Number(tsSaleId)),
    [contracts, tsSaleId]
  );

  const columns: GridColDef[] = [
    {
      field: 'tsSaleId',
      headerName: 'Id venda',
      width: 100,
      minWidth: 80,
    },
    {
      field: 'clientName',
      headerName: 'Nome cliente',
      width: 200,
      minWidth: 150,
    },
    {
      field: 'clientEmail',
      headerName: 'Email',
      width: 200,
      minWidth: 150,
    },
    {
      field: 'clientDocument',
      headerName: 'Documento cliente',
      width: 150,
      minWidth: 130,
    },
    {
      field: 'contractType',
      headerName: 'Tipo contrato',
      width: 120,
      minWidth: 100,
    },
    {
      field: 'saleDate',
      headerName: 'Data venda',
      width: 120,
      minWidth: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      minWidth: 80,
    },
    {
      field: 'projectXContract',
      headerName: 'Contrato',
      width: 170,
      minWidth: 150,
    },
    {
      field: 'cancellationDate',
      headerName: 'Cancelado em',
      width: 130,
      minWidth: 110,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      minWidth: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconOpenModal
            params={{ tsSaleId: params.row.tsSaleId }}
            type="show"
            tooltip="Ver detalhes"
          />
        </Box>
      ),
    },
   ];

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <ContractFilters
          filters={filters}
          setFilters={setFilters}
          handleSearch={handleSearch}
        />
        {isLoading ? (
          <LoadingData />
        ) : contracts.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ReusableDataGrid
                rows={contracts}
                columns={columns}
                getRowId={(row) => row.tsSaleId}
                pagination={{
                  enabled: false,
                }}
                responsive={{
                  enabled: true,
                  autoHideColumns: true,
                  minColumnWidth: 100,
                  breakpoints: {
                    xs: ['tsSaleId', 'clientDocument', 'contractType', 'cancellationDate'],
                    sm: ['tsSaleId', 'clientDocument', 'cancellationDate'],
                    md: ['tsSaleId', 'cancellationDate']
                  },
                  priorityColumns: ['clientName', 'projectXContract', 'status', 'actions']
                }}
                toolbar={{
                  enabled: true,
                  title: "Contratos Time Sharing",
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
                  filename: 'contratos-time-sharing',
                  buttonText: "Exportar CSV",
                }}
                print={{
                  enabled: true,
                  buttonText: "Imprimir",
                  title: "Relatório de Contratos Time Sharing"
                }}
              />
              <Box alignSelf="flex-end" marginTop="8px">
                <ModernPaginatedList
                  items={contracts}
                  lastPageNumber={lastPageNumber ?? 1}
                  handleChangePage={(e: React.ChangeEvent<unknown>, value: number) => handlePageChange(value)}
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
              </Box>
            </Stack>
          </>
        )}
      </Stack>
      {match({ action, selectedContract })
        .with(
          { action: "show", selectedContract: P.not(undefined) },
          ({ selectedContract }) => (
            <ShowDetailsModal shouldOpen={true} contract={selectedContract} />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
