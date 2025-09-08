import React, { useEffect, useState } from "react";
import Table from "@mui/joy/Table";
import { IconButton, Sheet, useTheme } from "@mui/joy";
import { OutstandingBill } from "@/utils/types/finance";
import { formatMoney } from "@/utils/money";
import { downloadBill } from "@/services/querys/finance-users";
import DownloadIcon from "@mui/icons-material/Download";
import useUser from "@/hooks/useUser";
import { Tooltip } from "@mui/material";
import { isDateBeforeToday } from "@/utils/dates";

const thereIsLocalStorage = typeof window !== "undefined" && window.localStorage;

export default function ListOutstandingBills({
  outstandingBills,
}: {
  outstandingBills: OutstandingBill[];
}) {
  const { settingsParams, isAdm } = useUser();
  const theme = useTheme();
  const LAST_SELECTED_ROW_INDEX = "outstandingBills_last_selected_row";
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  

  const originalTotalAmount = outstandingBills.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const currentTotalAmount = outstandingBills.reduce(
    (sum, item) => sum + item.currentValue,
    0
  );
  const counTypeableBillLine = outstandingBills.reduce((count, item) => {
    return item.typeableBillLine ? count + 1 : count;
  }, 0);
  const count = outstandingBills.length ?? 0;

  useEffect(() => {
    if (thereIsLocalStorage) {
      const savedRow = localStorage.getItem(LAST_SELECTED_ROW_INDEX);
      if (savedRow) {
        setSelectedRow(Number(savedRow));
      }
    }
  }, []);

  const handleRowClick = (id: number) => {
    setSelectedRow(id);
    if (thereIsLocalStorage)
      localStorage.setItem(LAST_SELECTED_ROW_INDEX, id.toString());
  };

  function getRowColor(status: string, dueDate: string): string {
  if (status.toLocaleLowerCase().includes("em aberto") && isDateBeforeToday(dueDate)) {
    return "red";
  } else if (status.toLocaleLowerCase().includes("paga")) {
    return "#2ca2cc";
  }
  return "black";
}

  return (
    <Sheet
      sx={{
        overflowX: "auto",
        width: "100%",
      }}
    >
      <Table
        borderAxis="bothBetween"
      >
        <thead>
          <tr>
            <td colSpan={1} style={{maxWidth: 90 }}>
              <b>Totais:</b>
            </td>
            <td style={{maxWidth: 300}}>
              <b>Qtd.: {count}</b>
            </td>
            <td style={{maxWidth: 300}}></td>
            <td style={{maxWidth: 200}}></td>
            <td style={{maxWidth: 200}}></td>
            <td style={{maxWidth: 120}}>
              <b>Original: {formatMoney(originalTotalAmount)}</b>
            </td>
            <td style={{maxWidth: 120}}>
              <b>Atualizado: {formatMoney(currentTotalAmount)}</b>
            </td>
            <td style={{maxWidth: 120}}></td>
            <td style={{maxWidth: 120}}></td>
            {counTypeableBillLine > 0 &&
            (settingsParams?.enableBillDownload || isAdm) ? (
              <td style={{maxWidth: 50}}></td>
            ) : null}
          </tr>
          <tr>
            <th>ID</th>
            <th>Contrato</th>
            <th>Empresa</th>
            <th>Nome cliente</th>
            <th>Tipo conta</th>
            <th>Valor Orig.</th>
            <th>Valor Atual</th>
            <th>Vencimento</th>
            <th>Pagamento</th>
            <th>Status</th>
            {counTypeableBillLine > 0 &&
            (settingsParams?.enableBillDownload || isAdm) ? (
              <th aria-label="last" className="last" />
            ) : null}
          </tr>
        </thead>

        <tbody>
          {outstandingBills.map((finance) => {
            const status = finance.status?.toLowerCase();
            const isSelected = finance.id === selectedRow;
           
            const color = getRowColor(status, finance.dueDate);
            
            return (
              <tr
                  key={finance.id}
                  data-selected={isSelected}
                  onClick={() => handleRowClick(finance.id)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#e0f7fa" : "transparent"
                  }}
                >
                  <td style={{ color }}>{finance.id}</td>
                  <td style={{ color }}>{finance.contrato}</td>
                  <td style={{ color }}>{finance.companyName}</td>
                  <td style={{ color }}>{finance.personName}</td>
                  <td style={{ color }}>{finance.accountTypeName}</td>
                  <td style={{ color }}>{formatMoney(finance.value)}</td>
                  <td style={{ color }}>{formatMoney(finance.currentValue)}</td>
                  <td style={{ color }}>{finance.dueDate}</td>
                  <td style={{ color }}>{finance.paymentDate}</td>
                  <td style={{ color }}>{finance.status}</td>
                  {finance.typeableBillLine && finance.status === "em aberto" && 
                    !finance.paymentBlockedByCrcStatus.toLocaleLowerCase().includes("s")  &&
                    (settingsParams?.enableBillDownload || isAdm) ? (
                    <td>
                      <Tooltip title="Baixar versão simplificada do boleto">
                        <IconButton
                          sx={{ padding: 0, color: "#2ca2cc" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadBill(finance.typeableBillLine, finance.id);
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </td>
                  ) : <td></td>}
                </tr>

            );
          })}
        </tbody>
      </Table>
    </Sheet>
  );
}
