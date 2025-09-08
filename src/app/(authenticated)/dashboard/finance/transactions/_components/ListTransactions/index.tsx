import React, { useEffect, useState } from "react";
import Table from "@mui/joy/Table";
import { Box, Sheet, useTheme } from "@mui/joy";
import { Transaction } from "@/utils/types/finance";
import { formatMoney } from "@/utils/money";
import IconOpenModal from "@/components/IconOpenModal";
import { TableCell, TableHead, TableRow } from "@mui/material";

const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function ListTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {

  const LAST_SELECTED_ROW_INDEX = "transactions_last_selected_row";
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
      if (thereIsLocalStorage)
      {
        const savedRow = localStorage.getItem(LAST_SELECTED_ROW_INDEX);
        if (savedRow) {
          setSelectedRow(savedRow);
        }
      }
    }, []);
  
    const handleRowClick = (id: string) => {
      setSelectedRow(id);
      if (thereIsLocalStorage) localStorage.setItem(LAST_SELECTED_ROW_INDEX, id.toString());
    };

  const qtdeTransactions = transactions.length;
  const totalTransactionsValue = transactions.reduce((acc, item) => acc + item.value, 0);

  return (
    <Sheet
      sx={{
        "--TableCell-height": "50px",
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "100px",
        "--Table-lastColumnWidth": "100px",
        overflow: "auto",
        backgroundSize:
          "40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "local, local, scroll, scroll",
        backgroundPosition:
          "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
        backgroundColor: "background.surface",
      }}
    >
      <Table
        borderAxis="bothBetween"
        sx={{
          "& tr > *:first-child": {
            position: "sticky",
            left: 0,
            boxShadow: "1px 0 var(--TableCell-borderColor)",
            //bgcolor: "background.surface",
          },
          "& tr > *:last-child": {
            position: "sticky",
            right: 0,
            bgcolor: "var(--TableCell-headBackground)",
          },
          "& th:first-of-type": {
            width: "var(--Table-firstColumnWidth)",
          },
          "& th:nth-of-type(2), & th:nth-of-type(3)": {
            width: "100px",
          },
          "& th:nth-of-type(4)": {
            width: "150px",
          },
          "& th:nth-of-type(5)": {
            width: "80px",
          },
          "& th:nth-of-type(6)": {
            width: "100px",
          },
          "& th:nth-of-type(7)": {
            width: "130px",
          },
          "& th:last-of-type": {
            width: "var(--Table-lastColumnWidth)",
          },
          "& thead th": {
            color: "primary.solidHoverBg",
          },
        }}
      >
        {/* Totalizador acima do corpo da tabela */}
          <TableHead>
            <TableRow>
                            <TableCell />
              <TableCell />
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Totais:
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                {qtdeTransactions}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                {formatMoney(totalTransactionsValue)}
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
        <thead>
          <tr>
            {/* <th>Id</th> */}
            <th>Id pessoa</th>
            <th>Chave transação</th>
            <th>Nome pessoa</th>
            <th>Status</th>
            <th>Valor</th>
            <th>Data de criação</th>
            <th aria-label="last" />
          </tr>
        </thead>
        
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transactionId}
            data-selected={transaction.transactionId === selectedRow}
              onClick={() => handleRowClick(transaction.transactionId)}
              style={{
                cursor: "pointer",
                backgroundColor: transaction.transactionId === selectedRow ? "#e0f7fa" : "transparent",
                color: transaction.transactionId === selectedRow ? "black" : theme.palette.text.primary,
              }}
            >
              {/* <td>{transaction.transactionId}</td> */}
              <td>{transaction.personId}</td>
              <td>{transaction.keyValue}</td>
              <td>{transaction.personName}</td>
              <td>{transaction.status}</td>
              <td>{formatMoney(transaction.value)}</td>
              <td>{transaction.date}</td>
              <td>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconOpenModal
                    params={{ transactionId: transaction.transactionId ?? transaction.hashCodeId }}
                    type="show"
                    sxoverride={{ color: "primary.solidHoverBg" }}
                    tooltip="Ver detalhes"
                  />
                  {transaction.status == "Autorizada" && !transaction.transactionId.startsWith("-") && !transaction.keyValue.includes("PixGenerate") ? (
                    <IconOpenModal
                      params={{ transactionId: transaction.transactionId ?? transaction.hashCodeId }}
                    sxoverride={{ color: "primary.solidHoverBg" }}
                      type="cancel"
                      tooltip="Cancelar transação"
                    />
                  ) : null}
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
        {/* Totalizador acima do corpo da tabela */}
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Totais:
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                {qtdeTransactions}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                {formatMoney(totalTransactionsValue)}
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
      </Table>
    </Sheet>
  );
}
