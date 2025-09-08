import * as React from "react";
import MaskInput from "../MaskInput";

type CepInputProps = {
  label: string;
  field: string;
  required: boolean;
};

export default function CepInput({ label, field, required }: CepInputProps) {
  return <MaskInput field={field} label={label} mask="00000-000" required={required} />;
}
