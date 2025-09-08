import * as React from "react";
import { IMaskInput } from "react-imask";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { useFormContext } from "react-hook-form";
import { SxProps } from "@mui/joy/styles/types";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  required?: boolean;
  disabled?: boolean;
}

const TextMaskAdapter = React.forwardRef<HTMLElement, CustomProps>(
  function TextMaskAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <IMaskInput
        {...other}
        ref={ref}
        mask={[{ mask: "000.000.000-00" }, { mask: "00.000.000/0000-00" }]}
        onAccept={(value: any) => {
          onChange({ target: { name: props.name, value } });
        }}
      />
    );
  }
);

type CpfOrCnpjInputProps = {
  label: string;
  field: string;
  required?: boolean;
  disabled?: boolean;
  sx?: SxProps;
};

export default function CpfOrCnpjInput({
  label,
  field,
  required,
  disabled,
  sx,
}: CpfOrCnpjInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl error={!!errors?.root?.generalError}>
      <FormLabel sx={sx}>{label}</FormLabel>
      <Input
        disabled={disabled}
        {...register(field)}
        slotProps={{
          input: {
            component: TextMaskAdapter,
            required,
            disabled,
          },
        }}
        required={required}
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
        }}
      />
    </FormControl>
  );
}
