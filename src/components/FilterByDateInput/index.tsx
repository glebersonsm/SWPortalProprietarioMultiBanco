import { FormControl, FormLabel, Input } from "@mui/joy";
import React from "react";

type Props = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorLabel?: string;
};
export default function FilterByDateInput({
  label,
  value,
  colorLabel,
  onChange,
}: Props) {
  return (
    <FormControl>
      <FormLabel sx={{ color: colorLabel }}>{label}</FormLabel>
      <Input
        type="date"
        value={value}
        onChange={onChange}
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
          color: "text.primary",
          "&::placeholder": {
            color: "text.secondary",
            opacity: 0.6,
          },
          "&:hover": {
            borderColor: "primary.500",
          },
          "&.Mui-focused": {
            borderColor: "primary.500",
            boxShadow: "0 0 0 2px var(--card-shadow-color, rgba(44, 162, 204, 0.2))",
          },
          "&.Mui-error": {
            borderColor: "danger.500",
          },
        }}
      />
    </FormControl>
  );
}
