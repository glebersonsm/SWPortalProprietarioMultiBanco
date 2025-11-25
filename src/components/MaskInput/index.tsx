import * as React from "react";
import { IMaskInput } from "react-imask";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { useFormContext } from "react-hook-form";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

const TextMaskAdapter = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskAdapter(props, ref) {
    const { onChange, mask, ...other } = props;
    return (
      <IMaskInput
        {...other}
        inputRef={ref}
        mask={mask}
        onAccept={(value: any) => {
          onChange({ target: { name: props.name, value } });
        }}
      />
    );
  }
);

type MaskInputProps = {
  label: string;
  field: string;
  mask: string | undefined;
  disabled?: boolean;
  required?: boolean;
};

export default function MaskInput({
  label,
  field,
  mask,
  disabled = false,
  required = false,
}: MaskInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl error={!!errors?.root?.generalError}>
      <FormLabel
        sx={{
          color: "primary.solidHoverBg",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
          fontSize: "14px",
          mb: 0.5,
        }}
      >
        {label}
      </FormLabel>
      <Input
        {...register(field)}
        disabled={disabled}
        required={required}
        variant="outlined"
        slotProps={{
          input: {
            component: (props) => <TextMaskAdapter {...props} mask={mask} />,
          },
        }}
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
