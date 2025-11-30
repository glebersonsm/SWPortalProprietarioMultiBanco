import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import { headCells } from "./fields";
import { UserOutstandingBill } from "@/utils/types/finance-users";

type SelectableTableHeadProps = {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  outstandingBills: UserOutstandingBill[];
};

export function SelectableTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
  outstandingBills,
}: SelectableTableHeadProps) {
  // Função auxiliar para verificar se uma conta pode ser selecionada
  const canSelectBill = (bill: typeof outstandingBills[0]): boolean => {
    const statusLower = bill.status.toLowerCase();
    const isOpen = statusLower.includes("em aberto");
    const isOverdue = statusLower.includes("vencida");
    const isBlocked = bill.paymentBlockedByCrcStatus.toLowerCase().includes("s");
    
    return (isOpen || isOverdue) && !isBlocked;
  };

  // Filtra apenas as contas selecionáveis
  const selectableBills = outstandingBills.filter(canSelectBill);
  
  const uniqueCompanies = new Set(
    selectableBills.map((bill) => bill.companyId)
  );

  const canEnableCheckAll = uniqueCompanies.size === 1 && selectableBills.length > 0;
  
  // Conta apenas as contas selecionáveis para o checkbox
  const selectableRowCount = selectableBills.length;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < selectableRowCount}
            checked={selectableRowCount > 0 && numSelected === selectableRowCount}
            onChange={onSelectAllClick}
            disabled={!canEnableCheckAll}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding="none"
            sx={{ fontWeight: "bold", color: "primary.solidHoverBg" }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
