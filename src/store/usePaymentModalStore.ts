import { create } from "zustand";
import { UserOutstandingBill } from "@/utils/types/finance-users";

interface SelectedBillsState {
  selectedBills: UserOutstandingBill[];
  setSelectedBills: (bills: UserOutstandingBill[]) => void;
  clearSelectedBills: () => void;
  totalValue: number;
  setTotalValue: (value: number) => void;
}

export const useSelectedBillsStore = create<SelectedBillsState>((set) => ({
  selectedBills: [],
  totalValue: 0,
  setSelectedBills: (bills) =>
    set({
      selectedBills: bills,
      totalValue: bills.reduce((acc, b) => acc + b.currentValue, 0),
    }),
  clearSelectedBills: () =>
    set({
      selectedBills: [],
      totalValue: 0,
    }),
  setTotalValue: (value) => set({ totalValue: value }),
}));