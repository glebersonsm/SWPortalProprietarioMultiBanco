"use client";

import { Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import { initialFilters } from "./constants";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import WithoutData from "@/components/WithoutData";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getUserOutstandingBills } from "@/services/querys/finance-users";
import { useSearchParams } from "next/navigation";
import { P, match } from "ts-pattern";
import PayPerPixModal from "./_components/PayPerPixModal";
import PayByCreditCard from "./_components/PayByCreditCardModal";
import UserOutstandingBillsFilters from "./_components/UserOutstandingBillsFilters";
import DownloadCertificatesModal from "./_components/DownloadCertificatesModal";
import { UserOutstandingBill } from "@/utils/types/finance-users";

import ReusableDataGrid from "@/components/ReusableDataGrid";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { formatMoney } from "@/utils/money";
import { IconButton, Box as MuiBox } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { downloadBill } from "@/services/querys/finance-users";
import useUser from "@/hooks/useUser";

const PAGE_STORAGE_KEY = "user_multiownership_outstanding_accounts_page";
const ROWS_PER_PAGE_STORAGE_KEY = "user_multiownership_outstanding_accounts_rows_per_page";

const thereIsLocalStorage = typeof window !== "undefined" && window.localStorage;

export default function OutstandingAccountsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(() => {
          if (thereIsLocalStorage)
            return Number(localStorage.getItem(PAGE_STORAGE_KEY)) || 1;
          else return 1;
        });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
      if (thereIsLocalStorage)
        return Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY)) || 10;
      else
      return 10;
    });
  
  useEffect(() => {
      if (thereIsLocalStorage)
      localStorage.setItem(PAGE_STORAGE_KEY, page.toString());
    }, [page]);
  
  useEffect(() => {
    if (thereIsLocalStorage)
    localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, rowsPerPage.toString());
  }, [rowsPerPage]);

  const [selectedAccounts, setSelectedAccounts] = React.useState<
    readonly UserOutstandingBill[]
  >([]);

  const debounceFilters = useDebounce(filters);
  const searchParams = useSearchParams();

  const { settingsParams } = useUser();

  const { isLoading, data } = useQuery({
    queryKey: ["getUserOutstandingBills", debounceFilters, page, rowsPerPage],
    queryFn: async () => getUserOutstandingBills(debounceFilters, page, rowsPerPage)
  });

  const { outstandingBills = [], lastPageNumber } = data ?? {};

  // Cálculo dos totais para exibição
  const totalOriginal = outstandingBills.reduce((acc, item) => acc + item.value, 0);
  const totalAtualizado = outstandingBills.reduce((acc, item) => acc + item.currentValue, 0);

  // Definição das colunas para a ReusableDataGrid
  const columns: GridColDef[] = [
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
            bill.status.toLowerCase().includes("aberto") && 
            !bill.paymentBlockedByCrcStatus.toLowerCase().includes("s") ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
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

  const { action, bills } = React.useMemo(() => {
  const action = searchParams.get("action");
  const bills = searchParams.get("bills");
  

  return {
      action,
      bills,
    };
  }, [searchParams]);

  const selectedBills = useMemo(() => {
    const arrayBillsIds = bills?.split(",").map((id) => parseInt(id));
    return outstandingBills.filter((bill) => arrayBillsIds?.includes(bill.id));
  }, [bills, outstandingBills]);

  const clearSelectedAccounts = () => {
    setSelectedAccounts([]);
  };

  function handleChangePage(event: ChangeEvent<unknown>, value: number): void {
    setPage(value);
  }

  // Função de seleção desativada temporariamente devido a erros
  // const handleSelectionModelChange = React.useCallback((newSelection: any) => {
  //   const selectionIds = Array.isArray(newSelection) ? newSelection : [];
  //   const selectedBills = outstandingBills.filter((bill) => 
  //     selectionIds.includes(bill.id) &&
  //     bill.status.toLowerCase().includes("aberto") &&
  //     !bill.paymentBlockedByCrcStatus.toLowerCase().includes("s")
  //   );
  //   const companyIds = Array.from(new Set(selectedBills.map(bill => bill.companyId)));
  //   if (companyIds.length <= 1) {
  //     setSelectedAccounts(selectedBills);
  //   }
  // }, [outstandingBills]);

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <UserOutstandingBillsFilters filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <LoadingData />
        ) : outstandingBills.length === 0 ? (
          <WithoutData />
        ) : (
          <Stack spacing={2}>
            {/* Exibição dos totais */}
            <MuiBox sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <MuiBox sx={{ display: 'flex', gap: 4 }}>
                <MuiBox>
                  <strong>Total Original: {formatMoney(totalOriginal)}</strong>
                </MuiBox>
                <MuiBox>
                  <strong>Total Atualizado: {formatMoney(totalAtualizado)}</strong>
                </MuiBox>
              </MuiBox>
            </MuiBox>

            <ReusableDataGrid
              rows={outstandingBills}
              columns={columns}
              loading={isLoading}
              // checkboxSelection desativado temporariamente
              // checkboxSelection
              // onSelectionModelChange={handleSelectionModelChange}
              // additionalProps={{
              //   isRowSelectable: (params: any) => {
              //     const bill = params.row as UserOutstandingBill;
              //     return bill.status.toLowerCase().includes("aberto") &&
              //            !bill.paymentBlockedByCrcStatus.toLowerCase().includes("s");
              //   },
              //   rowSelectionModel: selectedAccounts.map(bill => bill.id)
              // }}
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
                filename: "contas-em-aberto",
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
      {match({ action, selectedBills })
        .with(
          { action: "payPerPix", selectedBills: P.not(undefined) },
          ({ selectedBills }) => (
            <PayPerPixModal
              shouldOpen={true}
              selectedBills={selectedBills}
              clearSelectedAccounts={clearSelectedAccounts}
            />
          )
        )
        .with(
          { action: "payByCreditCard", selectedBills: P.not(undefined) },
          ({ selectedBills }) => (
            <PayByCreditCard
              shouldOpen={true}
              selectedBills={selectedBills}
              clearSelectedAccounts={clearSelectedAccounts}
            />
          )
        )
        .with({ action: "download-certificates" }, () => (
          <DownloadCertificatesModal shouldOpen={true} />
        ))
        .otherwise(() => null)}
    </>
  );
}

