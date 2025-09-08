import React, { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormLabel, Input } from "@mui/joy";
import ReactInputMask from "react-input-mask";

type InputMaskProps = {
  field: string;
  label: string;
  mask: string;
};

type InputProps = {
  id?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputMask({ field, label, mask }: InputMaskProps) {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <FormControl error={!!errors?.root?.generalError}>
      <FormLabel>{label}</FormLabel>
      <Controller
        control={control}
        name={field}
        render={({ field }) => (
          <ReactInputMask
            mask={mask}
            value={field.value}
            onChange={field.onChange}
          >
            {
              ((inputProps: InputProps) => (
                <Input {...inputProps} type="data" />
              )) as unknown as ReactNode
            }
          </ReactInputMask>
        )}
      />
    </FormControl>
  );
}
