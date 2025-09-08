"use client";

import React, { useMemo } from "react";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { useFormContext } from "react-hook-form";
import DocumentInput from "@/components/DocumentInput";
import { DocumentTypes } from "@/utils/types/users";
import useUser from "@/hooks/useUser";

type DocumentFieldsProps = {
  index?: number;
  documentTypes?: DocumentTypes[];
};

export default function DocumentFields({
  index,
  documentTypes,
}: DocumentFieldsProps) {
  const { watch } = useFormContext();
  const { isAdm, settingsParams } = useUser();

  const documentTypeId = watch(`documents.${index}.documentTypeId`);

  const documentType = useMemo(
    () => documentTypes?.find((item) => item.id === documentTypeId),
    [documentTypes, documentTypeId]
  );

  const fieldsFromDocument = useMemo(
    () => documentTypes?.filter((item) => item.id === documentTypeId),
    [documentTypes, documentTypeId]
  );

  const showDateOfIssue = fieldsFromDocument?.[0]?.requiresIssueDate;
  const showExpirationDate = fieldsFromDocument?.[0]?.requiresDueDate;
  const showIssuingBody = fieldsFromDocument?.[0]?.requiresIssuingBody;

  const allowEditing = !isAdm && !settingsParams?.allowUserChangeYourDoc;

  return (
    <>
      <SelectField
        options={documentTypes}
        field={`documents.${index}.documentTypeId`}
        label="Tipo de documento"
        disabled={allowEditing}
      />
      <DocumentInput
        field={`documents.${index}.number`}
        label="Número do documento"
        maskType={documentType?.name}
        disabled={allowEditing}
      />
      {!!showDateOfIssue ? (
        <InputField
          label="Data de emissão"
          type="date"
          field={`documents.${index}.dateOfIssue`}
          disabled={allowEditing}
        />
      ) : null}
      {!!showExpirationDate ? (
        <InputField
          label="Data de validade"
          type="date"
          field={`documents.${index}.expiryDate`}
          disabled={allowEditing}
        />
      ) : null}
      {!!showIssuingBody ? (
        <InputField
          label="Órgão emissor"
          field={`documents.${index}.issuingBody`}
          disabled={allowEditing}
        />
      ) : null}
    </>
  );
}
