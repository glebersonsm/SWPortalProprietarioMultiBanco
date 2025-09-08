"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
} from "@mui/joy";
import { useController, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/services/querys/city-search";
import useDebounce from "@/hooks/useDebounce";

type CitySearchFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  manualError?: string;
  defaultValue?: string;
  index?: string | number;
  disabled?: boolean;
  required?: boolean;
};

// Supondo que a cidade tenha este formato
type CityOption = {
  id: number;
  name: string;
  formattedName: string;
};

export default function CitySearchField({
  name,
  label,
  manualError,
  placeholder,
  defaultValue,
  index,
  disabled,
  required = false,
}: CitySearchFieldProps) {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const { field } = useController({
    name,
    control,
    defaultValue: defaultValue ?? null,
  });

  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [allCities, setAllCities] = useState<CityOption[]>([]);
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  const {
    data: citiesResponse,
    isLoading: isLoadingCities,
    isError: isErrorCities,
  } = useQuery({
    queryKey: [`CitySearchField-cities-${index}`, debouncedSearchTerm],
    queryFn: async () =>
      await searchCities({
        nome: debouncedSearchTerm as string,
      }),
    enabled: debouncedSearchTerm.length >= 2,
    // Mantém os dados da busca anterior visíveis enquanto a nova busca carrega
    placeholderData: (previousData) => previousData,
  });

  const cities = useMemo(() => citiesResponse?.data || [], [citiesResponse?.data]);
  const hasError = !!manualError || !!errors?.[name]?.message || isErrorCities;

  // Atualiza a lista de todas as cidades conhecidas
  useEffect(() => {
    if (cities.length > 0) {
      setAllCities(prevCities => {
        const newCities = [...prevCities];
        cities.forEach(city => {
          if (!newCities.find(c => c.id === city.id)) {
            newCities.push(city);
          }
        });
        return newCities;
      });
    }
  }, [cities]);

  // Encontra o objeto completo da cidade baseado no ID que está salvo no formulário
  const selectedValue = field.value
    ? allCities.find((city) => city.id === field.value) ?? selectedCity
    : null;

  // Sincroniza o estado local com a cidade selecionada
  useEffect(() => {
    if (selectedValue && selectedValue !== selectedCity) {
      setSelectedCity(selectedValue);
      setInputValue(selectedValue.formattedName || selectedValue.name);
    } else if (!field.value && selectedCity) {
      setSelectedCity(null);
      setInputValue("");
    }
  }, [field.value, selectedValue, selectedCity]);

  return (
    <Stack direction={"column"} gap={"10px"} width={"100%"}>
      <FormControl error={hasError}>
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
          {required && (
            <span style={{ color: "red", marginLeft: "4px" }}>*</span>
          )}
        </FormLabel>
        <Autocomplete
          placeholder={placeholder}
          options={cities}
          getOptionLabel={(option: CityOption) => option.formattedName || option.name}
          value={selectedValue}
          onChange={(_, newValue: CityOption | null) => {
            if (newValue) {
              field.onChange(newValue.id);
              setSelectedCity(newValue);
              setInputValue(newValue.formattedName || newValue.name);
            } else {
              field.onChange(null);
              setSelectedCity(null);
              setInputValue("");
            }
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
            // Se o usuário está digitando algo diferente da cidade selecionada, limpa a seleção
            if (selectedCity && newInputValue !== (selectedCity.formattedName || selectedCity.name)) {
              field.onChange(null);
              setSelectedCity(null);
            }
          }}
          loading={isLoadingCities}
          loadingText="Carregando cidades..."
          noOptionsText={inputValue.length < 2 ? "Digite para buscar" : "Nenhuma cidade encontrada"}
          disabled={disabled}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
        />
        {hasError && (
          <FormHelperText className="error-text">
            {manualError ||
              (errors?.[name]?.message as string) ||
              "Não foi possível carregar as cidades"}
          </FormHelperText>
        )}
      </FormControl>
    </Stack>
  );
}