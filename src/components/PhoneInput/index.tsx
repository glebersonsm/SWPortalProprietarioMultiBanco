import * as React from "react";
import MaskInput from "../MaskInput";

type PhoneInputProps = {
  label: string;
  field: string;
  maskType: string | undefined;
};

export default function PhoneInput({
  label,
  field,
  maskType,
}: PhoneInputProps) {
  const phoneMask = () => {
    switch (maskType) {
      case "Celular":
        return "(00) 00000-0000";
      case "Telefone":
        return "(00) 0000-0000";
      default:
        return "0000000000000000";
    }
  };

  return <MaskInput field={field} label={label} mask={phoneMask()} />;
}
