import { FiltersProps } from "@/utils/types/emails";

export const initialFilters: FiltersProps = {
  id: "",
  initialCreationDate: "",
  finalCreationDate: "",
  initialShippingDate: "",
  finalShippingDate: "",
  sent: "default",
  recipient: "",
  subject: "",
};
