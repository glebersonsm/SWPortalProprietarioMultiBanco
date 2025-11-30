"use client";

import { Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import { initialFilters } from "./constants";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import WithoutData from "@/components/WithoutData";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getUserOutstandingBills } from "@/services/querys/finance-users";
import { useSearchParams, useRouter } from "next/navigation";
import { P, match } from "ts-pattern";
import PayPerPixModal from "./_components/PayPerPixModal";
import PayByCreditCard from "./_components/PayByCreditCardModal";
import UserOutstandingBillsFilters from "./_components/UserOutstandingBillsFilters";
import DownloadCertificatesModal from "./_components/DownloadCertificatesModal";
import { UserOutstandingBill } from "@/utils/types/finance-users";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/joy";
import useUser from "@/hooks/useUser";

import ReusableDataGrid from "@/components/ReusableDataGrid";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import { GridColDef, GridRenderCellParams, GridRowClassNameParams } from "@mui/x-data-grid";
import { formatMoney } from "@/utils/money";
import { IconButton, Box as MuiBox } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { downloadBill } from "@/services/querys/finance-users";
import { isDateBeforeToday } from "@/utils/dates";

const PAGE_STORAGE_KEY = "user_multiownership_outstanding_accounts_page";
const ROWS_PER_PAGE_STORAGE_KEY = "user_multiownership_outstanding_accounts_rows_per_page";

const thereIsLocalStorage = typeof window !== "undefined" && window.localStorage;

export default function OutstandingAccountsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
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
            String(bill.status || "").toLowerCase().includes("aberto") &&
            !String(bill.paymentBlockedByCrcStatus || "").toLowerCase().includes("s") ? (
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

  // Função auxiliar para verificar se uma conta pode ser selecionada
  const canSelectBill = React.useCallback((bill: UserOutstandingBill): boolean => {
    const statusLower = String(bill.status || "").toLowerCase();
    const isOpen = statusLower.includes("em aberto");
    const isOverdue = statusLower.includes("vencida");
    const isBlocked = String(bill.paymentBlockedByCrcStatus || "").toLowerCase().includes("s");
    return (isOpen || isOverdue) && !isBlocked;
  }, []);

  // Função de seleção para contas em aberto ou vencidas
   const handleSelectionModelChange = React.useCallback((newSelection: any) => {
     const selectionIds = Array.isArray(newSelection) ? newSelection : (newSelection?.ids ?? []);
     const normalizedIds = selectionIds.map((id: any) => Number(id));
     const selectedBills = outstandingBills.filter((bill) =>
       normalizedIds.includes(bill.id) &&
       canSelectBill(bill)
     );

     const companyIds = Array.from(new Set(selectedBills.map(bill => bill.companyId)));
     if (companyIds.length <= 1) {
       setSelectedAccounts(selectedBills);
     } else if (selectedBills.length > 0) {
       alert("Você só pode selecionar contas da mesma empresa.");
       const lastSelectedBill = selectedBills[selectedBills.length - 1];
       setSelectedAccounts([lastSelectedBill]);
     }
   }, [outstandingBills, canSelectBill]);

  const router = useRouter();

  // Função para calcular o total das contas selecionadas
  const totalSelected = selectedAccounts.reduce((acc, bill) => acc + bill.currentValue, 0);

  // Função para abrir modal de pagamento via query params
  const handleOpenPaymentModal = (action: "payPerPix" | "payByCreditCard") => {
    const billsIds = selectedAccounts.map(bill => bill.id).join(",");
    router.push(`?action=${action}&bills=${billsIds}`);
  };

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
            {/* Toolbar de pagamento quando há contas selecionadas e pagamento online está habilitado */}
            {selectedAccounts.length > 0 && settingsParams?.enableOnlinePayment && (
              <Toolbar
                sx={{
                  pl: { sm: 2 },
                  pr: { xs: 1, sm: 1 },
                  pt: "5px",
                  pb: "5px",
                  justifyContent: "space-between",
                  bgcolor: (theme) =>
                    alpha(
                      theme.palette.primary.main,
                      theme.palette.action.activatedOpacity
                    ),
                }}
              >
                <Typography
                  color="inherit"
                  variant="body1"
                  fontWeight={600}
                  component="div"
                >
                  TOTAL = {formatMoney(totalSelected)}
                </Typography>

                <Stack gap={2} flexDirection="row">
                  {settingsParams?.enableCardPayment && (
                    <Button
                      onClick={() => handleOpenPaymentModal("payByCreditCard")}
                      sx={{
                        backgroundColor: "var(--color-button-primary)",
                        color: "var(--color-button-text)",
                        fontWeight: 600,
                        borderRadius: "8px",
                        padding: "8px 16px",
                        border: "none",
                        boxShadow: "none",
                        textTransform: "none",
                        fontFamily: "Montserrat, sans-serif",
                        "&:hover": {
                          backgroundColor: "var(--color-button-primary-hover)",
                        },
                        "&:focus": {
                          outline: "none",
                          boxShadow: "0 0 0 2px var(--color-highlight-border)",
                        },
                      }}
                    >
                      Pagar com cartão
                    </Button>
                  )}

                  {settingsParams?.enablePixPayment && (
                    <Button
                      onClick={() => handleOpenPaymentModal("payPerPix")}
                      sx={{
                        backgroundColor: "var(--color-button-primary)",
                        color: "var(--color-button-text)",
                        fontWeight: 600,
                        borderRadius: "8px",
                        padding: "8px 16px",
                        border: "none",
                        boxShadow: "none",
                        textTransform: "none",
                        fontFamily: "Montserrat, sans-serif",
                        "&:hover": {
                          backgroundColor: "var(--color-button-primary-hover)",
                        },
                        "&:focus": {
                          outline: "none",
                          boxShadow: "0 0 0 2px var(--color-highlight-border)",
                        },
                      }}
                    >
                      Pagar por pix
                    </Button>
                  )}
                </Stack>
              </Toolbar>
            )}

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
              checkboxSelection={true}
              onSelectionModelChange={handleSelectionModelChange}
               additionalProps={{
                 isRowSelectable: (params: any) => {
                   const bill = params.row as UserOutstandingBill;
                   return canSelectBill(bill);
                 },
                 getRowClassName: (params: GridRowClassNameParams<UserOutstandingBill>) => {
                   const status = params.row?.status?.toLowerCase();
                   if (status?.includes("em aberto") && isDateBeforeToday(params.row?.dueDate)) {
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

