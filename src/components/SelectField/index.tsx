import { FormControl, FormLabel, Select, Option } from "@mui/joy";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type OptionsProps = {
  name: string;
  id: string | number;
};

type SelectFieldProps = {
  options?: OptionsProps[];
  label: string;
  field: string;
  defaultValue?: string | number;
  required?: boolean;
  disabled?: boolean;
  sx?: object;
  colorLabel?: string;
};

export default function SelectField({
  options = [],
  field,
  label,
  defaultValue,
  required = false,
  disabled = false,
  sx = {},
  colorLabel = "primary.solidHoverBg",
}: SelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[field];

  return (
    <FormControl error={!!error} sx={{ ...sx }}>
      <FormLabel
        sx={{
          color: colorLabel,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
          fontSize: "14px",
          mb: 0.5,
          "&.Mui-focused": {
            color: colorLabel,
          },
        }}
      >
        {label}
      </FormLabel>

      <Controller
        name={field}
        control={control}
        defaultValue={defaultValue ?? ""}
        render={({ field: { onChange, value, ref } }) => (
          <Select
            required={required}
            disabled={disabled}
            value={value ?? ""}
            onChange={(_, val) => onChange(val)}
            slotProps={{ button: { ref } }}
            variant="outlined"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              color: "text.primary",
              minHeight: "48px",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "neutral.200",
              backgroundColor: "background.surface",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              "&:hover": {
                borderColor: "primary.300",
                backgroundColor: "rgba(44, 162, 204, 0.02)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(44, 162, 204, 0.12)",
              },
              "&.Mui-focused": {
                borderColor: "primary.400",
                backgroundColor: "background.surface",
                boxShadow: "0 0 0 4px rgba(44, 162, 204, 0.08), 0 8px 24px rgba(44, 162, 204, 0.15)",
                transform: "translateY(-2px)",
              },
              "&.Mui-error": {
                borderColor: "danger.300",
                boxShadow: "0 0 0 4px rgba(220, 53, 69, 0.08)",
              },
            }}
          >
            {options.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
        )}
      />

      {error && (
        <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {error.message?.toString()}
        </span>
      )}
    </FormControl>
  );
}
