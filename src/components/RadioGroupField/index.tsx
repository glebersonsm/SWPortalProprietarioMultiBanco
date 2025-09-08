import { FormControl, FormLabel, RadioGroup } from "@mui/joy";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type RadioGroupFieldProps = {
  label: string;
  field: string;
  disabled?: boolean;
  children: React.ReactNode;
  onChange?: (value: string) => void; // adiciona a prop onChange
};

export default function RadioGroupField({
  label,
  field,
  disabled = false,
  children,
  onChange,
}: RadioGroupFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={field}
      control={control}
      render={({ field: controllerField }) => (
        <FormControl
          sx={{
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? "none" : "auto",
          }}
        >
          <FormLabel>{label}</FormLabel>
          <RadioGroup
            {...controllerField}
            name={`radio-group-${field}`}
            sx={{ width: "100%", p: 1 }}
            onChange={(e) => {
              controllerField.onChange(e); 
              if (onChange) onChange(e.target.value);
            }}
          >
            {children}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
}
