"use client";

import CityField from "@/components/CityField";
import CpfOrCnpjInput from "@/components/CpfOrCnpjInput";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { BookingGuest } from "@/utils/types/multiownership/appointments";
import { Checkbox, Divider, Grid } from "@mui/joy";
import React, { ChangeEvent, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

type HostsFormProps = {
  index?: number;
  isMain? : boolean;
  isDisabledMainHostDefault? : boolean;
};
export default function HostsForm({ index, isDisabledMainHostDefault }: HostsFormProps) {
  const { setValue, control } = useFormContext();

  const currentAddress = useWatch({ control, name: `guests.${index}` });
  const currentAddresses = useWatch({
    control,
    name: `guests`,
  }) as BookingGuest[];

  const [mainHost, setMainHost] = useState(currentAddress.main);
  const mainHostIndex = useMemo(
    () => currentAddresses.findIndex((item) => item.main),
    [currentAddresses]
  );
  const isMainHost = index === mainHostIndex;
  const hasMainHost = mainHostIndex !== -1;
  const isDisabledMainHost = (hasMainHost && !isMainHost);

  const handleMainHost = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    setMainHost(checked);
    setValue(`guests.${index}.main`, checked);
  };

 const sexOptions = [
    { id: "M", name: "Masculino" },
    { id: "F", name: "Feminino" },
  ];

  return (
    <Grid container spacing={1} sx={{
      backgroundColor: 'var(--form-section-bg)',
      borderRadius: 1,
      p: 2,
      mb: 2,
      border: '1px solid var(--form-input-border)'
    }}>
      <Grid xs={12} md={12}>
       {isMainHost ?  
        (<b>Dados do hóspede principal</b>) :
        (<b>Dados do(a) convidado(a)</b>)}
      </Grid>
      <Grid xs={12} md={12}>
            <Divider />
          </Grid>
      <Grid xs={12} md={4}>
        <InputField label="Nome" field={`guests.${index}.name`} 
        disabled={isDisabledMainHostDefault && isMainHost} />
      </Grid>
      <Grid xs={12} md={2}>
        <InputField
          label="Data de nascimento"
          field={`guests.${index}.birthday`}
          type="date"
          disabled={isDisabledMainHostDefault && isMainHost}
          required={false}
        />
      </Grid>
      {!isMainHost && (
        <Grid xs={12}>
          <Checkbox
            label="Principal"
            checked={mainHost}
            disabled={isDisabledMainHost}
            onChange={handleMainHost}
          />
        </Grid>
      )}
  
      {isMainHost && (
        <>
          <Grid xs={12} md={2}>
            <CpfOrCnpjInput sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
          fontSize: "14px",
          mb: 0.5
          }} 
            field={`guests.${index}.cpf`} label="CPF" 
            required={false} disabled={isDisabledMainHostDefault && isMainHost}/>
          </Grid>
          <Grid xs={12} md={2}>
            <InputField label="Email" field={`guests.${index}.email`} 
            required={false} disabled={isDisabledMainHostDefault && isMainHost}/>
          </Grid>
          <Grid xs={12} md={2}>
            <SelectField
              options={sexOptions}
              label="Sexo"
              disabled={isDisabledMainHostDefault && isMainHost}
              field={`guests.${index}.sex`}
              defaultValue={"M"}
            />
          </Grid>

          <Grid xs={12} md={12}>
            <b>Endereço</b>
          </Grid>
          <Grid xs={12} md={12}>
            <Divider />
          </Grid>
          <Grid xs={12} md={2}>
            <InputField label="Logradouro" field={`guests.${index}.street`} required={false} disabled={isDisabledMainHostDefault && isMainHost}  />
          </Grid>
          <Grid xs={12} md={1}>
            <InputField label="Número" field={`guests.${index}.number`} required={false} disabled={isDisabledMainHostDefault && isMainHost}/>
          </Grid>
          <Grid xs={12} md={2}>
            <InputField label="Bairro" field={`guests.${index}.neighborhood`} required={false} disabled={isDisabledMainHostDefault && isMainHost}/>
          </Grid>
          <Grid xs={12} md={2}>
            <InputField
              label="Complemento"
              field={`guests.${index}.complement`}
              required={false}
              disabled={isDisabledMainHostDefault && isMainHost}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <CityField
              name={`guests.${index}.cityId`}
              label="Nome da cidade"
              placeholder="Selecione uma cidade"
              index={index}
              disabled={isDisabledMainHostDefault && isMainHost}
            />
          </Grid>
          <Grid xs={12} md={2}>
            <InputField label="CEP" field={`guests.${index}.cep`} 
            required={false} disabled={isDisabledMainHostDefault && isMainHost} />
          </Grid>
        </>
      )}
  
      {isMainHost && (
        <Grid xs={12}>
          <Checkbox
            label="Principal"
            checked={mainHost}
            disabled={isDisabledMainHostDefault && isMainHost}
            onChange={handleMainHost}
          />
        </Grid>
      )}
    </Grid>
  );
  
}
