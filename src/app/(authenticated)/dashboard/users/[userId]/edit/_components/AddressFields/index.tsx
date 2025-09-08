import React, { ChangeEvent, useState, useMemo } from "react";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { useFormContext, useWatch } from "react-hook-form";
import { Checkbox } from "@mui/joy";
import { Address, AddressTypes } from "@/utils/types/users";
import CityField from "@/components/CityField";

type AddressFieldsProps = {
  index?: number;
  addressTypes?: AddressTypes[];
};

export default function AddressFields({
  index,
  addressTypes,
}: AddressFieldsProps) {
  const { setValue, control } = useFormContext();

  const currentAddress = useWatch({ control, name: `addresses.${index}` });
  const currentAddresses = useWatch({
    control,
    name: `addresses`,
  }) as Address[];

  const startedNumber = currentAddress.number === "S/N" ? true : false;

  const [withoutNumber, setWithoutNumber] = useState(startedNumber);
  const [mainAddress, setMainAddress] = useState(currentAddress.isPreferential);

  const mainAddressIndex = useMemo(
    () => currentAddresses.findIndex((item) => item.isPreferential),
    [currentAddresses]
  );

  const isMainAddress = index === mainAddressIndex;
  const hasMainAddress = mainAddressIndex !== -1;

  const isDisableMainAddress = hasMainAddress && !isMainAddress;

  const handleWithoutNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    setWithoutNumber(checked);
    setValue(`addresses.${index}.number`, checked ? "S/N" : "");
  };

  const handleMainAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    setMainAddress(checked);
    setValue(`addresses.${index}.isPreferential`, checked);
  };

  return (
    <>
      <SelectField
        options={addressTypes}
        field={`addresses.${index}.addressTypeId`}
        label="Tipo de endereço"
      />
      <CityField
        name={`addresses.${index}.cityId`}
        label="Cidade"
        placeholder="Selecione uma cidade"
        index={index}
      />
      <InputField label="Logradouro" field={`addresses.${index}.street`} />
      <InputField
        disabled={withoutNumber}
        label="Número"
        field={`addresses.${index}.number`}
      />
      <Checkbox
        label="Sem número"
        checked={withoutNumber}
        onChange={handleWithoutNumber}
      />
      <InputField label="Bairro" field={`addresses.${index}.neighborhood`} />
      <InputField label="CEP" field={`addresses.${index}.cep`} />
      <Checkbox
        label="Preferencial"
        checked={mainAddress}
        disabled={isDisableMainAddress}
        onChange={handleMainAddress}
      />
    </>
  );
}
