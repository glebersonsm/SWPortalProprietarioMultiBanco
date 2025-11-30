"use client";

import { Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import { initialFilters } from "./constants";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import WithoutData from "@/components/WithoutData";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getUserOutstandingBills, downloadBill } from "@/services/querys/finance-users"; // downloadBill importado corretamente
import { useSearchParams } from "next/navigation";
import UserOutstandingBillsFilters from "./_components/UserOutstandingBillsFilters";
import DownloadCertificatesModal from "./_components/DownloadCertificatesModal";
import { UserOutstandingBill } from "@/utils/types/finance-users";
import { Button } from "@mui/joy";
import useUser from "@/hooks/useUser";

import ReusableDataGrid from "@/components/ReusableDataGrid";
import ModernPaginatedList from "@/components/ModernPaginatedList";
// Use GridRowId para tipar o array de IDs
import { GridColDef, GridRenderCellParams, GridRowClassNameParams, GridRowId } from "@mui/x-data-grid";
import { formatMoney } from "@/utils/money";
import { IconButton, Box as MuiBox, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { isDateBeforeToday } from "@/utils/dates";

const PAGE_STORAGE_KEY = "user_multiownership_outstanding_accounts_page";
const ROWS_PER_PAGE_STORAGE_KEY = "user_multiownership_outstanding_accounts_rows_per_page";

// Simplificando a verificação de localStorage
const thereIsLocalStorage = typeof window !== "undefined" && window.localStorage;

export default function OutstandingAccountsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  // Onde o DataGrid armazena os IDs selecionados
  const [selectedRowIds, setSelectedRowIds] = React.useState<GridRowId[]>([]);
  
  // --- Lógica de Local Storage (Mantida) ---
  useEffect(() => {
    if (thereIsLocalStorage) {
      try { localStorage.setItem(PAGE_STORAGE_KEY, page.toString()); } catch {}
    }
  }, [page]);
  
  useEffect(() => {
    if (thereIsLocalStorage) {
      try { localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, rowsPerPage.toString()); } catch {}
    }
  }, [rowsPerPage]);

  useEffect(() => {
    if (thereIsLocalStorage) {
      try {
        const p = Number(localStorage.getItem(PAGE_STORAGE_KEY));
        if (p) setPage(p);
        const rpp = Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY));
        if (rpp) setRowsPerPage(rpp);
      } catch {}
    }
  }, []);
  // ----------------------------------------

  const debounceFilters = useDebounce(filters);
  const searchParams = useSearchParams();

  const { settingsParams, isAdm } = useUser();

  const { isLoading, data } = useQuery({
    queryKey: ["getUserOutstandingBills", debounceFilters, page, rowsPerPage],
    queryFn: async () => getUserOutstandingBills(debounceFilters, page, rowsPerPage)
  });

  const { outstandingBills = [], lastPageNumber } = data ?? {};
  

  // Função para checar se a conta está "Em Aberto" (pode ser selecionada e paga)
  const isOpenStatus = (status: any) => String(status || "").toLowerCase().includes("em aberto");

  // Função que retorna se uma linha pode ser selecionada
  const canSelectBill = React.useCallback((bill: UserOutstandingBill): boolean => {
    return isOpenStatus(bill.status);
  }, []);

  // --- LÓGICA DE SELEÇÃO CORRIGIDA ---
  const handleSelectionModelChange = React.useCallback((newSelection: any) => {
      const normalizeSelectionIds = (input: any): GridRowId[] => {
        if (Array.isArray(input)) return input;
        if (input instanceof Set) return Array.from(input);
        if (input && typeof input === "object") {
          if (Array.isArray((input as any).model)) return (input as any).model;
          if (Array.isArray((input as any).selectionModel)) return (input as any).selectionModel;
          if (Array.isArray((input as any).ids)) return (input as any).ids;
        }
        return input != null ? [input] : [];
      };

      const normalized = normalizeSelectionIds(newSelection)
        .filter((id) => id != null && id !== undefined && id !== "")
        .map((id) => Number(id))
        .filter((id) => !isNaN(id) && id > 0);

      const newSelectedBills = outstandingBills.filter((bill) =>
        normalized.includes(bill.id) && canSelectBill(bill)
      );

      const companyIds = Array.from(new Set(newSelectedBills.map((bill) => bill.companyId)));
      
      if (companyIds.length <= 1) {
          setSelectedRowIds(normalized);
      } else {
          alert("Você só pode selecionar contas da mesma empresa.");
          const conflictingId = normalized.filter((id) => !selectedRowIds.includes(id))[0];
          if (conflictingId) {
            setSelectedRowIds(selectedRowIds);
          } else {
            setSelectedRowIds(normalized);
          }
      }
  }, [outstandingBills, canSelectBill, selectedRowIds]);
  // ----------------------------------------


  // Cálculo dos totais para exibição
  const totalOriginal = outstandingBills.reduce((acc, item) => acc + item.value, 0);
  const totalAtualizado = outstandingBills.reduce((acc, item) => acc + item.currentValue, 0);




  function handleChangePage(event: ChangeEvent<unknown>, value: number): void {
    setPage(value);
  }


  const action = React.useMemo(() => {
    return searchParams.get("action");
  }, [searchParams]);

  // Definição das colunas (mantidas)
  const columns: GridColDef[] = [
    // ... (restante das colunas mantido)
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      type: 'number',
    },
    {
      field: 'companyName',
      headerName: 'Empresa',
      width: 200,
      flex: 1,
    },
    {
      field: 'contrato',
      headerName: 'Contrato',
      width: 200,
      flex: 1,
    },
    {
      field: 'accountTypeName',
      headerName: 'Detalhes',
      width: 200,
      flex: 1,
    },
    {
      field: 'value',
      headerName: 'Valor original',
      width: 140,
      type: 'number',
      renderCell: (params: GridRenderCellParams<UserOutstandingBill>) => {
        return formatMoney(params.row.value);
      },
    },
    {
      field: 'currentValue',
      headerName: 'Valor atualizado',
      width: 140,
      type: 'number',
      renderCell: (params: GridRenderCellParams<UserOutstandingBill>) => {
        return formatMoney(params.row.currentValue);
      },
    },
    {
      field: 'dueDate',
      headerName: 'Vencimento',
      width: 120,
      renderCell: (params: GridRenderCellParams<UserOutstandingBill>) => {
        return params.row.processingDate ?? params.row.dueDate;
      },
    },
    {
      field: 'paymentDate',
      headerName: 'Pagamento',
      width: 120,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserOutstandingBill>) => {
        const bill = params.row;
        return (
          <MuiBox sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            {bill.typeableBillLine &&
            settingsParams?.enableBillDownload &&
            String(bill.status || "").toLowerCase().includes("em aberto") ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  // Função downloadBill é importada
                  downloadBill(bill.typeableBillLine, bill.id); 
                }}
                title="Baixar boleto simplificado"
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            ) : null}
          </MuiBox>
        );
      },
    },
  ];


  return (
    <>
      {!mounted ? <LoadingData /> : (
        <>
        <Stack spacing={3} divider={<Divider />}>
        <UserOutstandingBillsFilters filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <LoadingData />
        ) : outstandingBills.length === 0 ? (
          <WithoutData />
        ) : (
            <Stack spacing={2}>
            <MuiBox sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ gap: 2, flexWrap: 'wrap' }}>
                  <Stack spacing={1} sx={{ flex: 1, minWidth: 240 }}>
                    <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap' }}>
                      <Typography variant="body1" fontWeight={600} sx={{ fontFamily: "Montserrat, sans-serif" }}>
                        Total Original: {formatMoney(totalOriginal)}
                      </Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ fontFamily: "Montserrat, sans-serif" }}>
                        Total Atualizado: {formatMoney(totalAtualizado)}
                      </Typography>
                    </Stack>
                  </Stack>
                  
                </Stack>
              </Stack>
            </MuiBox>

            <ReusableDataGrid
              rows={outstandingBills}
              columns={columns}
              loading={isLoading}
              checkboxSelection={true}
              onSelectionModelChange={handleSelectionModelChange}
              additionalProps={{
                 // Garante que só contas "em aberto" podem ser selecionadas
                isRowSelectable: (params: any) => { 
                  const bill = params.row as UserOutstandingBill;
                  return canSelectBill(bill);
                },
                getRowClassName: (params: GridRowClassNameParams<UserOutstandingBill>) => {
                  const status = params.row?.status?.toLowerCase();
                   if (status && status.includes("em aberto") && isDateBeforeToday(params.row?.dueDate)) {
                     return "overdue-row";
                   }
                   if (status?.includes("paga")) {
                     return "paid-row";
                   }
                   return "";
                 }
               }}
              pagination={{
                enabled: false,
              }}
              toolbar={{
                title: "Contas",
                showQuickFilter: true,
                showColumnsButton: true,
                showFiltersButton: true,
                showExportButton: true,
                showPrintButton: true,
              }}
              export={{
                enabled: true,
                filename: "Parcelas",
              }}
              print={{
                enabled: true,
                buttonText: "Imprimir",
              }}
              filters={{
                enabled: true,
                quickFilter: true,
                columnFilters: true,
              }}
            />
            <MuiBox alignSelf="flex-end" marginTop="8px">
              <ModernPaginatedList
                items={outstandingBills}
                lastPageNumber={lastPageNumber ?? 1}
                handleChangePage={(e: React.ChangeEvent<unknown>, value: number) => setPage(value)}
                page={page}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={(value) => {
                  setRowsPerPage(value);
                  setPage(1);
                }}
              />
            </MuiBox>
          </Stack>
        )}
      </Stack>
      {action === "download-certificates" ? (
        <DownloadCertificatesModal shouldOpen={true} />
      ) : null}
        </>
      )}
    </>
  );
}
