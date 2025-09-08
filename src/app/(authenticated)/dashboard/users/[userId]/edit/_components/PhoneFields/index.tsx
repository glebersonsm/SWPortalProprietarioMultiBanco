import React, { useMemo } from "react";
import SelectField from "@/components/SelectField";
import PhoneInput from "@/components/PhoneInput";
import { useFormContext } from "react-hook-form";
import { PhoneTypes } from "@/utils/types/users";

type PhoneFieldsProps = {
  index?: number;
  phoneTypes?: PhoneTypes[];
};

export default function PhoneFields({ index, phoneTypes }: PhoneFieldsProps) {
  const { watch } = useFormContext();

  const phoneTypeId = watch(`phones.${index}.phoneTypeId`);

  const phoneType = useMemo(
    () => phoneTypes?.find((item) => item.id === phoneTypeId),
    [phoneTypes, phoneTypeId]
  );

  return (
    <>
      <SelectField
        options={phoneTypes}
        field={`phones.${index}.phoneTypeId`}
        label="Tipo de telefone"
      />
      <PhoneInput
        label="Número do telefone"
        field={`phones.${index}.number`}
        maskType={phoneType?.name}
      />
    </>
  );
}
