"use client";

import { FormControl, FormLabel, FormHelperText } from "@mui/joy";
import Input from "@mui/joy/Input";
import { SxProps } from "@mui/material";
import { useFormContext } from "react-hook-form";

type InputFieldProps = {
  label: string;
  field: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  colorLabel?: string;
  helperText?: string;
  sx?: SxProps;
};

export default function InputField({
  label,
  field,
  type = "text",
  disabled = false,
  required = true,
  defaultValue,
  placeholder,
  colorLabel = "var(--color-info-text)",
  helperText,
  sx = {},
}: InputFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[field];

  return (
    <FormControl error={!!error}>
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
      <Input
        {...register(field)}
        type={type}
        disabled={disabled}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
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
          "&::placeholder": {
            color: "text.secondary",
            opacity: 0.6,
          },
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
          // Estilos específicos para input de arquivo
          ...(type === "file" && {
            "& input[type='file']": {
              padding: "8px 12px",
              cursor: "pointer",
            },
            "& input[type='file']::-webkit-file-upload-button": {
              backgroundColor: "#2ca2cc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              marginRight: "12px",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(44, 162, 204, 0.2)",
            },
            "& input[type='file']::-webkit-file-upload-button:hover": {
              backgroundColor: "#035781",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(44, 162, 204, 0.3)",
            },
            "& input[type='file']::-webkit-file-upload-button:active": {
              transform: "translateY(0)",
              boxShadow: "0 2px 4px rgba(44, 162, 204, 0.2)",
            },
            // Para Firefox
            "& input[type='file']::-moz-file-upload-button": {
              backgroundColor: "#2ca2cc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              marginRight: "12px",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "all 0.3s ease",
            },
            "& input[type='file']::-moz-file-upload-button:hover": {
              backgroundColor: "#035781",
            },
          }),
          ...sx,
        }}
      />
      {(error || helperText) && (
        <FormHelperText
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
            color: error ? "danger.500" : "text.secondary",
            fontSize: "0.75rem",
            mt: 0.5,
            opacity: error ? 1 : 0.8,
          }}
        >
          {error ? error.message?.toString() : helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}
