import React from "react";
import Checkbox from "@mui/joy/Checkbox";
import { Controller, useFormContext } from "react-hook-form";

type CheckboxFieldProps = {
  label: string;
  field: string;
  disabled?: boolean;
  colorLabel?: string;
  fontSize?: number;
};
export default function CheckboxField({
  label,
  field,
  disabled = false,
  colorLabel = "primary.plainColor",
  fontSize = 16,
}: CheckboxFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={field}
      control={control}
      defaultValue={false}
      render={({ field: { onChange, onBlur, value } }) => (
        <Checkbox
          onBlur={onBlur}
          disabled={disabled}
          label={label}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          slotProps={{
            label: {
              sx: {
                color: value ? colorLabel : "black",
                fontWeight: 600,
                fontSize: fontSize,
                transition: "color 0.3s ease",
              },
            },
          }}
        />
      )}
    />
  );
}
