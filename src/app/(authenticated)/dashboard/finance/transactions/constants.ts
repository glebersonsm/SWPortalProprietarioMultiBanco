import { FiltersTransactions } from "@/utils/types/finance";

export const initialFilters: FiltersTransactions = {
  personName: "",
  personId: "",
  paymentStatus: "default",
  paymentType: "default",
  finalDate: "",
  initialDate: "",
  companyId: -1
};
