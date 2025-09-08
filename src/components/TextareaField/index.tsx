"use client";

import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { SxProps } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";

type TextareaFieldProps = {
  label: string;
  field: string;
  required?: boolean;
  minRows?: number;
  colorLabel?: string;
  sx?: SxProps;
};

export default function TextareaField({
  label,
  field,
  required = true,
  minRows = 2,
  colorLabel ="primary.solidHoverBg",
  sx = {},
}: TextareaFieldProps) {
  const { register } = useFormContext();

  return (
    <FormControl>
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
      <Textarea
        {...register(field)}
        required={required}
        minRows={minRows}
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
          ...sx,
        }}
      />
    </FormControl>
  );
}
