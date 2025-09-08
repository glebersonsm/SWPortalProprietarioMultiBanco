import React, { useMemo } from "react";
import MaskInput from "../MaskInput";

type DocumentInputProps = {
  label: string;
  field: string;
  maskType: string | undefined;
  disabled?: boolean;
};

export default function DocumentInput({
  label,
  field,
  maskType,
  disabled = false,
}: DocumentInputProps) {
  const documentMask = useMemo(() => {
    switch (maskType) {
      case "CPF":
        return "000.000.000-00";
      case "CNPJ":
        return "00.000.000/0000-00";
      case "RG":
        return "00.000.000-0";
      case "CNH":
        return "00000000000";
      default:
        return "0000000000000000";
    }
  }, [maskType]);

  return (
    <MaskInput
      field={field}
      label={label}
      disabled={disabled}
      mask={documentMask}
    />
  );
}
