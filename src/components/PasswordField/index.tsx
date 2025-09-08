"use client";

import { FormControl, FormLabel, IconButton } from "@mui/joy";
import Input from "@mui/joy/Input";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { SxProps } from "@mui/joy/styles/types";

type PasswordFieldProps = {
  label: string;
  field: string;
  disabled?: boolean;
  required?: boolean;
  sx?: SxProps;
};

export default function PasswordField({
  label,
  field,
  disabled = false,
  required = true,
  sx = {},
}: PasswordFieldProps) {
  const [show, setShow] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl error={!!errors?.root?.generalError}>
      <FormLabel sx={sx}>{label}</FormLabel>
      <Input
        {...register(field)}
        type={show ? "text" : "password"}
        disabled={disabled}
        required={required}
        sx={sx}
        endDecorator={
          <IconButton onClick={() => setShow(!show)}>
            {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        }
      />
    </FormControl>
  );
}