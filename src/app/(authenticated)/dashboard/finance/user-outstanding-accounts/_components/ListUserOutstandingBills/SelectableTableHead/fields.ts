import { UserOutstandingBill } from "@/utils/types/finance-users";

type HeadCell = {
  id: keyof UserOutstandingBill;
  label: string;
};

export const headCells: readonly HeadCell[] = [
  {
    id: "id",
    label: "ID",
  },
  {
    id: "companyName",
    label: "Empresa",
  },
  {
    id: "contrato",
    label: "Contrato",
  },
  {
    id: "accountTypeName",
    label: "Detalhes",
  },
  {
    id: "value",
    label: "Valor original",
  },
  {
    id: "currentValue",
    label: "Valor atualizado",
  },
  {
    id: "dueDate",
    label: "Vencimento",
  },
  {
    id: "paymentDate",
    label: "Pagamento",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "typeableBillLine",
    label: "",
  },
];
