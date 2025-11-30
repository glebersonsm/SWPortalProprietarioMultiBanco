import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { SelectableTableHead } from "./SelectableTableHead";
import { UserOutstandingBill } from "@/utils/types/finance-users";
import { formatMoney } from "@/utils/money";
import { IconButton, Paper, TableHead } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { downloadBill } from "@/services/querys/finance-users";
import useUser from "@/hooks/useUser";
import { Sheet } from "@mui/joy";
import { formatDate } from "date-fns";

export default function ListUserOutstandingBills({
  outstandingBills,
  selected,
  setSelected,
}: {
  outstandingBills: UserOutstandingBill[];
  selected: readonly UserOutstandingBill[];
  setSelected: React.Dispatch<
    React.SetStateAction<readonly UserOutstandingBill[]>
  >;
}) {
  const { settingsParams, isAdm } = useUser();

  // Função auxiliar para verificar se uma conta pode ser selecionada
  // Clientes: apenas contas "Em aberto"
  // Admins: contas "Em aberto" ou "Vencidas"
  const canSelectBill = (bill: UserOutstandingBill): boolean => {
    const statusLower = String(bill.status || "").toLowerCase();
    const isOpen = statusLower.includes("em aberto");
    const isOverdue = statusLower.includes("vencida");
    const isBlocked = String(bill.paymentBlockedByCrcStatus || "").toLowerCase().includes("s");
    
    // Se bloqueada, não pode selecionar
    if (isBlocked) return false;
    
    // Cliente: apenas "Em aberto"
    if (!isAdm) {
      return isOpen;
    }
    
    // Admin: "Em aberto" ou "Vencidas"
    return isOpen || isOverdue;
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Seleciona apenas contas que podem ser selecionadas (Em aberto ou Vencidas)
      const selectableBills = outstandingBills.filter(canSelectBill);
      
      // Verifica se todas são da mesma empresa
      const uniqueCompanies = new Set(selectableBills.map(bill => bill.companyId));
      if (uniqueCompanies.size === 1) {
        setSelected(selectableBills);
      }
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    outstandingBill: UserOutstandingBill
  ) => {
    const selectedIndex = selected.indexOf(outstandingBill);
    let newSelected: readonly UserOutstandingBill[] = [];

    // Verifica se a conta pode ser selecionada
    if (!canSelectBill(outstandingBill)) {
      const statusLower = String(outstandingBill.status || "").toLowerCase();
      const isBlocked = String(outstandingBill.paymentBlockedByCrcStatus || "").toLowerCase().includes("s");
      
      if (isBlocked) {
        alert("Seleção não permitida.");
        return;
      }
      
      // Mensagem diferente para cliente e admin
      if (!isAdm) {
        if (!statusLower.includes("em aberto")) {
          alert("Você só pode selecionar contas com status 'Em aberto'.");
          return;
        }
      } else {
        if (!statusLower.includes("em aberto") && !statusLower.includes("vencida")) {
          alert("Você só pode selecionar contas com status 'Em aberto' ou 'Vencidas'.");
          return;
        }
      }
      
      return;
    }

    // Verifica se todas as contas selecionadas são da mesma empresa
    if (selected.length > 0) {
      const selectedCompanyId = selected[0].companyId;

      if (outstandingBill.companyId !== selectedCompanyId) {
        alert("Você só pode selecionar contas da mesma empresa.");
        return;
      }
    }

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, outstandingBill);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (outstandingBill: UserOutstandingBill) =>
    selected.indexOf(outstandingBill) !== -1;

  const totalOriginal = outstandingBills.reduce((acc, item) => acc + item.value, 0);
  const totalAtualizado = outstandingBills.reduce((acc, item) => acc + item.currentValue, 0);

  return (
    <Sheet
      sx={{
        "--TableCell-height": "50px",
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "90px",
        "--Table-lastColumnWidth": "50px",
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
      
        sx={{
          "& tr > *:first-child": {
            position: "sticky",
            left: 0,
            boxShadow: "1px 0 var(--TableCell-borderColor)",
            bgcolor: "background.surface",
            zIndex: 2,
          },
          "& tr > *:last-child": {
            position: "sticky",
            right: 0,
            bgcolor: "var(--TableCell-headBackground)",
            zIndex: 2,
          },
          "& th:nth-of-type(1)": { width: 50 },
          "& th:nth-of-type(2)": { width: 80 },
          "& th:nth-of-type(3)": { width: 200 }, 
          "& th:nth-of-type(4)": { width: 200 }, 
          "& th:nth-of-type(5)": {
            width: 200,
          },
          "& th:nth-of-type(6)": { width: 100 },
          "& th:nth-of-type(7)": { width: 100 },
          "& th:nth-of-type(8)": { width: 100 },
          "& th:nth-of-type(9)": { width: 100 },
          "& th:nth-of-type(10)": { width: 100 },
          "& th:last-child": { width: "var(--Table-lastColumnWidth)" },
          "& tbody tr": {
            cursor: "pointer",
          },
          "& tbody tr[data-selected='true']": {
            backgroundColor: "#e0f7fa",
            color: "black",
          },
          "& tbody tr[data-selected='false']": {
            backgroundColor: "transparent",
          },
          "& thead th": {
            color: "secondary.main",
          },
          "& thead th:first-of-type": {
            position: "sticky",
            left: 0,
            zIndex: 3,
            backgroundColor: "background.paper",
          },
          "& tbody td:first-of-type": {
            position: "sticky",
            left: 0,
            zIndex: 2,
            backgroundColor: "background.surface",
            boxShadow: "1px 0 3px rgba(0,0,0,0.1)",
          },
          "& thead th:last-of-type": {
            position: "sticky",
            right: 0,
            zIndex: 3,
            backgroundColor: "background.paper",
          },
          "& tbody td:last-of-type": {
            position: "sticky",
            right: 0,
            zIndex: 2,
            backgroundColor: "white",
          },
        }}
        aria-labelledby="tableTitle"
      >

        {/* Totalizador acima do corpo da tabela */}
        <TableHead>
          <TableRow>
            <TableCell align="right" sx={{ fontWeight: "bold", minWidth: 100, width: 100 }}>
              Totais:
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0", minWidth: 100, width: 100  }}>
              Original: {formatMoney(totalOriginal)}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0", minWidth: 100, width: 100  }}>
              Atualizado: {formatMoney(totalAtualizado)}
            </TableCell>
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
          </TableRow>
        </TableHead>

        <SelectableTableHead
          numSelected={selected.length}
          onSelectAllClick={handleSelectAllClick}
          rowCount={outstandingBills.length}
          outstandingBills={outstandingBills}
        />

        
        <TableBody>
          {outstandingBills.map((outstandingBill, index) => {
            const isItemSelected = isSelected(outstandingBill);
            const labelId = `enhanced-table-checkbox-${index}`;

            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, outstandingBill)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={outstandingBill.id}
                selected={isItemSelected}
                sx={{ cursor: "pointer" }}
              >
                {canSelectBill(outstandingBill) ? (
                  <TableCell
                    padding="checkbox"
                    sx={{
                      width: "40px",
                      minWidth: "40px",
                      maxWidth: "40px",
                      position: "sticky",
                      left: 0,
                      zIndex: 3,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                ) : (
                  <TableCell/>
                )}
                <TableCell
                  component="th"
                  id={labelId}
                  scope="row"
                  align="center"
                  padding="none"
                >
                  {outstandingBill.id}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10 }}>
                  {outstandingBill.companyName}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 10 }}>
                  {outstandingBill.contrato}
                </TableCell>
                <TableCell align="center" >
                  {outstandingBill.accountTypeName}
                </TableCell>
                <TableCell align="center">
                  {formatMoney(outstandingBill.value)}
                </TableCell>
                <TableCell align="center">
                  {formatMoney(outstandingBill.currentValue)}
                </TableCell>
                <TableCell align="center">
                  {outstandingBill.processingDate ?? outstandingBill.dueDate}
                </TableCell>
                <TableCell align="center">{outstandingBill.paymentDate}</TableCell>
                <TableCell align="center">{outstandingBill.status}</TableCell>

                <TableCell align="center" >
                  {outstandingBill.typeableBillLine &&
                  settingsParams?.enableBillDownload && outstandingBill.status.toLocaleLowerCase().includes("aberto") && 
                  !outstandingBill.paymentBlockedByCrcStatus.toLocaleLowerCase().includes("s") ? (
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={(e) => {
                      e.stopPropagation();
                      downloadBill(
                        outstandingBill.typeableBillLine,
                        outstandingBill.id
                      );
                      }}
                      title="Baixar boleto simplificado"
                    >
                      <DownloadIcon />
                    </IconButton>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        {/* Totalizador acima do corpo da tabela */}
        <TableHead>
          <TableRow>
            <TableCell align="right" sx={{ fontWeight: "bold", minWidth: 100, width: 100 }}>
              Totais:
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0", minWidth: 100, width: 100  }}>
              Original: {formatMoney(totalOriginal)}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0", minWidth: 100, width: 100  }}>
              Atualizado: {formatMoney(totalAtualizado)}
            </TableCell>
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
            <TableCell  />
          </TableRow>
        </TableHead>
      </Table>
    </Sheet>
  );
}
