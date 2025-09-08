"use client";

import { Divider, Stack, Box as MuiBox, IconButton, Box } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import React, { ChangeEvent, useState } from "react";
import { initialFilters } from "./constants";
import { useSearchParams } from "next/navigation";
import { P, match } from "ts-pattern";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import TransactionsFilters from "./_components/TransactionsFilters";
import CancelTransaction from "./_components/CancelTransactionModal";
import { useGetTransactions } from "./hook";
import { ReusableDataGrid } from "@/components/ReusableDataGrid";

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { formatMoney } from "@/utils/money";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import { Transaction } from "@/utils/types/finance";
import IconOpenModal from "@/components/IconOpenModal";
import ModernPaginatedList from "@/components/ModernPaginatedList";

export default function TransactionsPage() {
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
  } = useGetTransactions();

  const { transactions = [], lastPageNumber } = data ?? {};

  // Cálculo dos totais
  const totalQuantity = transactions.length;
  const totalValue = transactions.reduce((acc, item) => acc + item.value, 0);

  const { action, transactionId } = React.useMemo(() => {
  const action = searchParams.get("action");
  const transactionId = searchParams.get("transactionId") ?? searchParams.get("hashCodeId");

    return {
      action,
      transactionId,
    };
  }, [searchParams]);

  const selectedTransaction = React.useMemo(
    () =>
      transactions.find(
        (transaction) => transaction.transactionId === transactionId || transaction.hashCodeId === transactionId
      ),
    [transactions, transactionId]
  );

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    handlePageChange(value);
  };

  const handleSearch = () => {
    handleFiltersChange(filters);
  };

  // Definição das colunas da grid
  const columns: GridColDef[] = [
    {
      field: 'transactionId',
      headerName: 'Id',
      width: 120,
      sortable: true,
    },
    {
      field: 'personId',
      headerName: 'Id pessoa',
      width: 120,
      sortable: true,
    },
    {
      field: 'keyValue',
      headerName: 'Chave transação',
      width: 150,
      sortable: true,
    },
    {
      field: 'personName',
      headerName: 'Nome pessoa',
      width: 200,
      sortable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: true,
    },
    {
      field: 'value',
      headerName: 'Valor',
      width: 120,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <span>{formatMoney(params.value as number)}</span>
      ),
    },
    {
      field: 'date',
      headerName: 'Data de criação',
      width: 150,
      sortable: true,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const transaction = params.row as Transaction;
        return (
          <MuiBox sx={{ display: "flex", gap: 1 }}>
            <IconOpenModal
              params={{ transactionId: transaction.transactionId ?? transaction.hashCodeId }}
              type="show"
              sxoverride={{ color: "primary.solidHoverBg" }}
              tooltip="Ver detalhes"
            />
            {transaction.status === "Autorizada" && 
             !transaction.transactionId.startsWith("-") && 
             !transaction.keyValue.includes("PixGenerate") ? (
              <IconOpenModal
                params={{ transactionId: transaction.transactionId ?? transaction.hashCodeId }}
                sxoverride={{ color: "primary.solidHoverBg" }}
                type="cancel"
                tooltip="Cancelar transação"
              />
            ) : null}
          </MuiBox>
        );
      },
    },
  ];

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <TransactionsFilters
          filters={filters}
          setFilters={setFilters}
          handleSearch={handleSearch}
        />
        {isLoading ? (
          <LoadingData />
        ) : transactions.length === 0 ? (
          <WithoutData />
        ) : (
          <Stack spacing={2}>
            {/* Exibição dos totais */}
            <MuiBox sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'background.level1', borderRadius: 'sm' }}>
              <MuiBox sx={{ textAlign: 'center' }}>
                <strong>Qtd:</strong> {totalQuantity}
              </MuiBox>
              <MuiBox sx={{ textAlign: 'center' }}>
                <strong>Total:</strong> {formatMoney(totalValue)}
              </MuiBox>
            </MuiBox>
            
            <ReusableDataGrid
              rows={transactions.map((transaction, index) => ({
                id: transaction.transactionId || index,
                ...transaction,
              }))}
              columns={columns}
              loading={isLoading}
              disableRowSelectionOnClick
              checkboxSelection={false}
              toolbar={{
                showExportButton: true,
                showPrintButton: true,
                showFiltersButton: true,
                showColumnsButton: true,
              }}
              pagination={{
                enabled: false,
                useLocalStorage: true,
              }}
            />
            <Box alignSelf="flex-end" marginTop="8px">
                <ModernPaginatedList
                  items={transactions}
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
        )}
      </Stack>
      {match({ action, selectedTransaction })
        .with(
          { action: "show", selectedTransaction: P.not(undefined) },
          ({ selectedTransaction }) => (
            <ShowDetailsModal
              shouldOpen={true}
              transaction={selectedTransaction}
            />
          )
        )
        .with(
          { action: "cancel", selectedTransaction: P.not(undefined) },
          ({ selectedTransaction }) => (
            <CancelTransaction
              shouldOpen={true}
              transaction={selectedTransaction}
            />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
