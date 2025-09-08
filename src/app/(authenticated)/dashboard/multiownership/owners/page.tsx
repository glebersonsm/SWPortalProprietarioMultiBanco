"use client";

import LoadingData from "@/components/LoadingData";
import useDebounce from "@/hooks/useDebounce";
import { Box, Divider, Stack } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import WithoutData from "@/components/WithoutData";
import { getOwners } from "@/services/querys/multiownership/owners";
import ReusableDataGrid from "@/components/ReusableDataGrid";
import { initialFilters } from "./constants";
import OwnerFilters from "./_components/OwnerFilters";
import { P, match } from "ts-pattern";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import { ModalScheduling } from "./_components/ModalScheduling";
import { Owner } from "@/utils/types/multiownership/owners";
import { GridColDef } from "@mui/x-data-grid";
import { IconButton, Tooltip } from "@mui/material";
import DownloadingIcon from "@mui/icons-material/Downloading";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import { downloadContractSCPAdm } from "@/services/querys/multiownership/owners";
import { useMutation } from "@tanstack/react-query";
import IconOpenModal from "@/components/IconOpenModal";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import { useRouter } from "next/navigation";

const PAGE_STORAGE_KEY = "owners_page";
const ROWS_PER_PAGE_STORAGE_KEY = "owners_rows_per_page";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function PropertiesPage() {
  const [filters, setFilters] = React.useState(initialFilters);
  const debounceFilters = useDebounce(filters);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(() => {
      if (thereIsLocalStorage)
        return Number(localStorage.getItem(PAGE_STORAGE_KEY)) || 1;
      else return 1;
    });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
      return thereIsLocalStorage ? Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY)) || 10 : 10;
    });

  useEffect(() => {
    if (thereIsLocalStorage)
      localStorage.setItem(PAGE_STORAGE_KEY, page.toString());
  }, [page]);

  useEffect(() => {
    if (thereIsLocalStorage)
      localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, rowsPerPage.toString());
  }, [rowsPerPage]);

  const { isLoading, data } = useQuery({
    queryKey: ["getOwners", debounceFilters, page, rowsPerPage],
    queryFn: async () => getOwners(debounceFilters, page, rowsPerPage),
  });

  const { owners = [], lastPageNumber } = data ?? {};

  const downloadMutation = useMutation({
    mutationFn: async (quotaId: number) => {
      const response = await downloadContractSCPAdm({ cotaId: quotaId });
      return response;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Contrato_${new Date().toISOString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Erro ao baixar contrato", error);
    },
  });

  const { action, quotaId } = React.useMemo(() => {
    const action = searchParams.get("action");
    const quotaId = searchParams.get("quotaId");

    return {
      action,
      quotaId,
    };
  }, [searchParams]);

  const handleChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const selectedOwner = React.useMemo(
    () => owners.find((owner) => owner.quotaId === Number(quotaId)),
    [owners, quotaId]
  );

  const columns: GridColDef[] = [
    {
      field: 'quotaId',
      headerName: 'ID da cota',
      width: 120,
      minWidth: 100,
      type: 'number',
    },
    {
      field: 'contractNumber',
      headerName: 'Número contrato',
      width: 180,
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'clientName',
      headerName: 'Nome cliente',
      width: 200,
      minWidth: 180,
      flex: 1.2,
    },
    {
      field: 'clientEmail',
      headerName: 'Email cliente',
      width: 200,
      minWidth: 180,
      flex: 1.2,
    },
    {
      field: 'clientDocument',
      headerName: 'CPF/CNPJ',
      width: 150,
      minWidth: 130,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'enterpriseName',
      headerName: 'Empreendimento',
      width: 180,
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'idIntercambiadora',
      headerName: 'Identificação RCI',
      width: 150,
      minWidth: 120,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'propertyNumber',
      headerName: 'Imóvel',
      width: 100,
      minWidth: 80,
    },
    {
      field: 'fractionCode',
      headerName: 'Fração',
      width: 100,
      minWidth: 80,
    },
    {
      field: 'purchaseDate',
      headerName: 'Data aquisição',
      width: 130,
      minWidth: 120,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const owner = params.row as Owner;
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconOpenModal
              params={{ quotaId: owner.quotaId }}
              type="show"
              sxoverride={{ color: "primary.plainColor" }}
              tooltip="Ver detalhes"
            />
            <IconOpenModal
              params={{ quotaId: owner.quotaId }}
              type="calendar"
              sxoverride={{ color: "primary.plainColor" }}
              tooltip="Incluir agendamento"
            />
            <Tooltip title="Ver agendamentos - Na visão do cliente">
              <IconButton
                size="small"
                sx={{ color: "primary.plainColor" }}
                onClick={() => {
                  sessionStorage.setItem('owner', JSON.stringify(owner));
                  router.push('/dashboard/user-multiownership-appointment/ListAppointmentsAdmView');
                }}
              >
                <CalendarViewMonthIcon />
              </IconButton>
            </Tooltip>
            {owner.hasSCPContract && (
              <Tooltip title="Baixar contrato">
                <IconButton
                  size="small"
                  sx={{ color: "primary.plainColor" }}
                  onClick={() => downloadMutation.mutate(owner.quotaId)}
                  disabled={downloadMutation.isPending}
                >
                  <DownloadingIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <OwnerFilters filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <LoadingData />
        ) : owners.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <ReusableDataGrid
              rows={owners}
              columns={columns}
              getRowId={(row) => row.quotaId}
              pagination={{
                enabled: false,
              }}
              responsive={{
                enabled: true,
                autoHideColumns: true,
                minColumnWidth: 100,
                breakpoints: {
                  xs: ['quotaId', 'idIntercambiadora', 'purchaseDate', 'fractionCode'],
                  sm: ['quotaId', 'idIntercambiadora', 'purchaseDate'],
                  md: ['quotaId', 'idIntercambiadora']
                },
                priorityColumns: ['clientName', 'contractNumber', 'actions']
              }}
              toolbar={{
                enabled: true,
                title: "Proprietários",
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
                filename: 'proprietarios',
                buttonText: "Exportar CSV",
              }}
              print={{
                enabled: true,
                buttonText: "Imprimir",
              }}
            />
            <Box alignSelf="flex-end" marginTop="8px">
              <ModernPaginatedList
                items={owners}
                lastPageNumber={lastPageNumber ?? 1}
                handleChangePage={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={(value) => {
                  setRowsPerPage(value);
                  setPage(1);
                }}
              />
            </Box>
          </>
        )}
      </Stack>
      {match({ action, selectedOwner })
        .with(
          { action: "show", selectedOwner: P.not(undefined) },
          ({ selectedOwner }) => (
            <ShowDetailsModal shouldOpen={true} owner={selectedOwner} />
          )
        )
        .with(
          { action: "calendar", selectedOwner: P.not(undefined) },
          ({ selectedOwner }) => (
            <ModalScheduling shouldOpen={true} quotaId={selectedOwner.quotaId} />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
