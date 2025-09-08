"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPhoneTypes } from "@/services/querys/phoneTypes";
import { getAddressTypes } from "@/services/querys/addressTypes";
import { getDocumentTypes } from "@/services/querys/documentTypes";
import LoadingData from "@/components/LoadingData";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FormControl, FormLabel, Option, Select, Stack } from "@mui/joy";
import AddForm from "./_components/Form";

export default function AddUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [personType, setPersonType] = React.useState(0);
  const { isLoading, data, isError, refetch } = useQuery({
    queryKey: ["getPersonTypeInformation"],
    queryFn: async () => {
      const [phoneTypes, addressTypes, documentTypes] = await Promise.all([
        getPhoneTypes({ personType: personType }),
        getAddressTypes({ personType: personType }),
        getDocumentTypes({ personType: personType }),
      ]);

      return { phoneTypes, addressTypes, documentTypes };
    },
  });

  const { phoneTypes, addressTypes, documentTypes } = data || {};

  const handleChangePersonType = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    newValue: number | null
  ) => {
    setPersonType(newValue!);
    queryClient.invalidateQueries({ queryKey: ["getPersonTypeInformation"] });
  };

  if (isError) {
    toast.error("Não é possível adicionar um usuário nesse momento!");
    router.push(`/dashboard`);
  }

  React.useEffect(() => {
    refetch();
  }, [personType, refetch]);

  return isLoading ? (
    <LoadingData />
  ) : (
    <Stack spacing={3}>
      <FormControl>
        <FormLabel>Tipo de pessoa</FormLabel>
        <Select value={personType} onChange={handleChangePersonType}>
          <Option value={0}>Pessoa Física</Option>
          <Option value={1}>Pessoa Jurídica</Option>
        </Select>
      </FormControl>
      <AddForm
        personType={personType}
        phoneTypes={phoneTypes}
        addressTypes={addressTypes}
        documentTypes={documentTypes}
      />
    </Stack>
  );
}
