import React, { useCallback, useState } from "react";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@mui/joy";
import { useController, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "@/services/querys/cities";
import useDebounce from "@/hooks/useDebounce";
type CityFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  manualError?: string;
  defaultValue?: string;
  index?: string | number;
  disabled?: boolean;
  colorLabel?: string;
};
export default function CityField({
  name,
  label,
  manualError,
  placeholder,
  defaultValue,
  index,
  disabled,
  colorLabel = "var(--color-info-text)",
}: CityFieldProps) {
  const {
    formState: { errors },
    control,
    getValues,
  } = useFormContext();

  const { field } = useController({
    name,
    control,
    defaultValue: defaultValue ?? null,
  });

  const initialId = getValues(name);

  const [inputValue, setInputValue] = useState("");
  const [inputId, setInputId] = useState(initialId ?? null);

  const debouncedValue = useDebounce(inputValue, 500);
  const debouncedId = useDebounce(inputId, 500);

  const {
    data: cities,
    isLoading: isLoadingPeople,
    isError: isErrorPeople,
  } = useQuery({
    queryKey: [`CityField-cities-${index}`, debouncedValue],
    queryFn: async () =>
      await getCities({
        search: debouncedValue as string,
        id: debouncedId,
      }),
  });

  const hasError = !!manualError || !!errors?.[name]?.message || isErrorPeople;

  const handleChange = (_: any, selectedOption: any) => {
    field.onChange(selectedOption?.id ?? null);
  };

  const handleInputChange = useCallback(
    (_: any, newInputValue: any) => {
      setInputValue(newInputValue);
      setInputId(null);
    },
    [setInputValue]
  );

  const getOptionLabel = (option: any) => option.formattedName;

  return (
    <FormControl error={hasError}>
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
        <Autocomplete
          value={
            cities?.data?.find((option) => option.id === field.value) ?? null
          }
          options={cities?.data ?? []}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          onInputChange={handleInputChange}
          getOptionLabel={getOptionLabel}
          noOptionsText={"Nenhum dado encontrado"}
          loading={isLoadingPeople} 
          loadingText={<span className="loading-text">Carregando...</span>}
          renderOption={(props, option) => (
            <li {...props} key={option.id} className="option-item">
              {getOptionLabel(option)}
            </li>
          )}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            minHeight: "48px",
            borderRadius: "14px",
            fontWeight: 500,
            "& .MuiAutocomplete-input": {
              color: "text.primary",
              "&::placeholder": {
                color: "text.secondary",
                opacity: 0.6,
              },
            },
            "& .MuiOutlinedInput-root": {
              minHeight: "48px",
              borderRadius: "14px",
              border: "1px solid",
              borderColor: "neutral.200",
              backgroundColor: "background.surface",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              "& .MuiOutlinedInput-input": {
                padding: "10.5px 14px",
              },
              "&:hover": {
                borderColor: "primary.300",
                backgroundColor: "rgba(44, 162, 204, 0.02)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(44, 162, 204, 0.12)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&.Mui-focused": {
                borderColor: "primary.400",
                backgroundColor: "background.surface",
                boxShadow: "0 0 0 4px rgba(44, 162, 204, 0.08), 0 8px 24px rgba(44, 162, 204, 0.15)",
                transform: "translateY(-2px)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&.Mui-error": {
                borderColor: "danger.300",
                boxShadow: "0 0 0 4px rgba(220, 53, 69, 0.08)",
              },
              "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
            },
          }}
        />
      {hasError && (
        <FormHelperText
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
            color: "danger.500",
            fontSize: "0.75rem",
            mt: 0.5,
            opacity: 1,
          }}
        >
          {manualError || errors?.[name]?.message?.toString() || "Não foi possível carregar as cidades"}
        </FormHelperText>
      )}
    </FormControl>
  );
}
