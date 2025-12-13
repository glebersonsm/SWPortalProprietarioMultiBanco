"use client";

import { Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import { initialFilters } from "./constants";
import WithoutData from "@/components/WithoutData";
import { ChangeEvent, useState } from "react";
import OutstandingBillsFilters from "./_components/OutstandingBillsFilters";
import { useGetOutSandingAccounts } from "./hook";
import ReusableDataGrid from "@/components/ReusableDataGrid";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import { GridColDef, GridRenderCellParams, GridRowClassNameParams } from "@mui/x-data-grid";
import { formatMoney } from "@/utils/money";
import { IconButton, Box as MuiBox } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { downloadBill } from "@/services/querys/finance-users";
import useUser from "@/hooks/useUser";
import { OutstandingBill } from "@/utils/types/finance";
import { isDateBeforeToday } from "@/utils/dates";

export default function OutstandingAccountsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const { settingsParams, isAdm } = useUser();

  const { 
          data, 
          handleFiltersChange, 
          handlePageChange, 
          isLoading, 
          page,
          rowsPerPage,
          setRowsPerPage
        } = useGetOutSandingAccounts();

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
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{params.row.id}</span>;
      },
    },
    {
      field: 'contrato',
      headerName: 'Contrato',
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{params.row.contrato}</span>;
      },
    },
    {
      field: 'companyName',
      headerName: 'Empresa',
      width: 200,
      flex: 1,
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{params.row.companyName}</span>;
      },
    },
    {
      field: 'personName',
      headerName: 'Nome cliente',
      width: 200,
      flex: 1,
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{params.row.personName}</span>;
      },
    },
    {
      field: 'accountTypeName',
      headerName: 'Tipo conta',
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{params.row.accountTypeName}</span>;
      },
    },
    {
      field: 'value',
      headerName: 'Valor Orig.',
      width: 140,
      type: 'number',
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{formatMoney(params.row.value)}</span>;
      },
    },
    {
      field: 'currentValue',
      headerName: 'Valor Atual',
      width: 140,
      type: 'number',
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{formatMoney(params.row.currentValue)}</span>;
      },
    },
    {
      field: 'dueDate',
      headerName: 'Vencimento',
      width: 120,
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{params.row.dueDate}</span>;
      },
    },
    {
      field: 'paymentDate',
      headerName: 'Pagamento',
      width: 120,
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{params.row.paymentDate}</span>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const status = params.row.status?.toLowerCase();
        const color = status?.includes("em aberto") && isDateBeforeToday(params.row.dueDate) ? "red" : 
                     status?.includes("paga") ? "#2ca2cc" : "black";
        return <span style={{ color }}>{params.row.status}</span>;
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<OutstandingBill>) => {
        const bill = params.row;
        const counTypeableBillLine = outstandingBills.reduce((count, item) => {
          return item.typeableBillLine ? count + 1 : count;
        }, 0);
        
        return (
          <MuiBox sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            {bill.typeableBillLine && 
            bill.status === "em aberto" && 
            !bill.paymentBlockedByCrcStatus.toLowerCase().includes("s") &&
            counTypeableBillLine > 0 &&
            (settingsParams?.enableBillDownload || isAdm) ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadBill(bill.typeableBillLine, bill.id);
                }}
                title="Baixar versão simplificada do boleto"
                sx={{ color: "#2ca2cc" }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            ) : null}
          </MuiBox>
        );
      },
    },
  ];

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    handlePageChange(value);
  };

  const handleSearch = () => {
    handleFiltersChange(filters);
  };

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <OutstandingBillsFilters
          filters={filters}
          setFilters={setFilters}
          handleSearch={handleSearch}
        />
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
                  <strong>Qtd.: {outstandingBills.length}</strong>
                </MuiBox>
                <MuiBox>
                  <strong>Original: {formatMoney(totalOriginal)}</strong>
                </MuiBox>
                <MuiBox>
                  <strong>Atualizado: {formatMoney(totalAtualizado)}</strong>
                </MuiBox>
              </MuiBox>
            </MuiBox>

            <ReusableDataGrid
              rows={outstandingBills}
              columns={columns}
              loading={isLoading}
              additionalProps={{
                getRowClassName: (params: GridRowClassNameParams<OutstandingBill>) => {
                  const status = params.row?.status?.toLowerCase();
                  if (status?.includes("em aberto") && isDateBeforeToday(params.row?.dueDate)) {
                    return "overdue-row";
                  }
                  if (status?.includes("paga")) {
                    return "paid-row";
                  }
                  return "";
                },
              }}
              pagination={{
                enabled: false,
              }}
              toolbar={{
                title: "Contas à Receber",
                showQuickFilter: true,
                showColumnsButton: true,
                showFiltersButton: true,
                showExportButton: true,
                showPrintButton: true,
              }}
              export={{
                enabled: true,
                filename: "contas-a-receber",
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
                handleChangePage={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={(value) => {
                  setRowsPerPage(value);
                  handlePageChange(1);
                }}
              />
            </MuiBox>
          </Stack>
        )}
      </Stack>
    </>
  );
}
