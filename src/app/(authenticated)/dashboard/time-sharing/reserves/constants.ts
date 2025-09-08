import { FiltersProps } from "@/utils/types/timeSharing/reserves";

export const initialFilters: FiltersProps = {
  showAllHosts: false,
  reserveNumber: "",
  contractNumber: "",
  clientName: "",
  hotel: "",
  clientDocument: "",
  reserveStatus: null,
  initialCheckin: "",
  finalCheckin: "",
  initialCheckout: "",
  finalCheckout: "",
};
