import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { SelectableTableHead } from "./SelectableTableHead";
import { SelectableTableToolbar } from "./SelectableTableToolbar";
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
  const { settingsParams } = useUser();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(outstandingBills);
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

    if (outstandingBill.status.toLocaleLowerCase().includes("em aberto") && 
                !outstandingBill.paymentBlockedByCrcStatus.toLocaleLowerCase().includes("s"))
    {
      if (!outstandingBill.status.toLowerCase().includes("em aberto")) {
          alert("Você só pode selecionar contas com status 'Em aberto'.");
          return;
        }

        if (outstandingBill.paymentBlockedByCrcStatus.toLowerCase().includes("s")) {
          alert("Pagamento não permitido.");
          return;
        }      

      if (selected.length > 0) {
        const selectedCompanyId = selected[0].companyId;

        if (outstandingBill.companyId !== selectedCompanyId) {
          alert("Você só pode selecionar contas da mesma empresa.");
          return;
        }
      }
  }
  else return;

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
      <SelectableTableToolbar selectedBills={selected} />
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
                {outstandingBill.status.toLocaleLowerCase().includes("em aberto") && 
                !outstandingBill.paymentBlockedByCrcStatus.toLocaleLowerCase().includes("s") ? (
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
