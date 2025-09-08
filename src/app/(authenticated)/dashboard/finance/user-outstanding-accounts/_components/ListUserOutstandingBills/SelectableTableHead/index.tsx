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
  const uniqueCompanies = new Set(
    outstandingBills.map((bill) => bill.companyId)
  );
  const existsAccountBlocked = outstandingBills.reduce(
    (count, item) => count + (item.paymentBlockedByCrcStatus.toLocaleLowerCase().includes("s") ? 1 : 0),
    0
  );

  const existsPaidAccount = outstandingBills.reduce(
    (count, item) => count + (item.status.toLocaleLowerCase().includes("paga") ? 1 : 0),
    0
  );

  const canEnableCheckAll = uniqueCompanies.size === 1 && existsAccountBlocked === 0 && existsPaidAccount === 0;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
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
