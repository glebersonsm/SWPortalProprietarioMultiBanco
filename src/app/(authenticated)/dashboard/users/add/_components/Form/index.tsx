"use client";

import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, FormLabel, Stack, Typography } from "@mui/joy";
import CheckboxField from "@/components/CheckboxField";
import { addUser, editUser } from "@/services/querys/users";
import TagsInput from "@/components/TagsInput";
import DynamicMultiForm from "@/components/DynamicMultiForm";

import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import AlertError from "@/app/(auth)/_components/AlertError";
import {
  DocumentTypes,
  AddressTypes,
  CompleteUserSent,
  PhoneTypes,
} from "@/utils/types/users";
import { untransformedUsers } from "@/services/api/transformUsers";
import { AxiosError } from "axios";
import ListCompanies from "@/components/ListCompanies";
import DocumentFields from "../../../[userId]/edit/_components/DocumentFields";
import AddressFields from "../../../[userId]/edit/_components/AddressFields";
import PhoneFields from "../../../[userId]/edit/_components/PhoneFields";
import { getCompanies } from "@/services/querys/companies";

export type FormProps = {
  personType: number;
  phoneTypes: PhoneTypes[] | undefined;
  addressTypes: AddressTypes[] | undefined;
  documentTypes: DocumentTypes[] | undefined;
};

export default function AddForm({
  personType,
  phoneTypes,
  addressTypes,
  documentTypes,
}: FormProps) {
  const form = useForm<CompleteUserSent>();

  const {
    formState: { errors },
    setError,
  } = form;

  const { data: companies = [] } = useQuery({
    queryKey: ["getCompanies"],
    queryFn: async () => getCompanies(),
  });

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não é possível adicionar um usuário nesse momento, por favor tente mais tarde!",
    });
  };

  const handleAddUser = useMutation({
    mutationFn: addUser,
    onError: onErrorHandler,
  });

  const redirectToUsers = useCloseModal(`/dashboard/users`);

  function onSubmit(data: CompleteUserSent) {
    if (data.companies?.length === 0 || data.companies == undefined) {
      setError("root.generalError", {
        message: "É necessário selecionar ao menos uma empresa",
      });
      return;
    }
    handleAddUser.mutate(
      untransformedUsers({ ...data, personType: personType }),
      {
        onSuccess: () => {
          toast.success(`Usuário adicionado com sucesso!`);
          redirectToUsers();
        },
      }
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <InputField label="Nome" field="name" />
          <InputField label="Email" field="email" />

          <TagsInput />
          {companies ? (
            <ListCompanies userCompanies={companies} />
          ) : (
            <Typography color="primary">
              *Esse usuário não tem empresas cadastradas
            </Typography>
          )}

          <Stack gap={2}>
            <FormLabel>Gerenciamento de acessos</FormLabel>
            <CheckboxField label="Ativo" field="isActive" />
            <CheckboxField label="Administrador" field="isAdm" />
          </Stack>

          <DynamicMultiForm
            title="Documentos"
            name="documents"
            field={(index) => (
              <DocumentFields index={index} documentTypes={documentTypes} />
            )}
            capacity={0}
          />
          <DynamicMultiForm
            title="Endereços"
            name="addresses"
            field={(index) => (
              <AddressFields index={index} addressTypes={addressTypes} />
            )}
            capacity={0}
          />
          <DynamicMultiForm
            title="Telefones"
            name="phones"
            field={(index) => (
              <PhoneFields index={index} phoneTypes={phoneTypes} />
            )}
            capacity={0}
          />
          <AlertError error={errors.root?.generalError?.message} />
        </Stack>

        <Stack spacing={2} direction={"row"} justifyContent={"flex-start"}>
          <Button
            variant="outlined"
            color="danger"
            sx={{
              marginTop: "10px",
              width: {
                xs: "100%",
                md: "200px",
              },
            }}
            onClick={redirectToUsers}
          >
            Sair
          </Button>
          <Button
            type="submit"
            sx={{
              backgroundColor: "var(--color-button-primary)",
              color: "var(--color-button-text)",
              fontWeight: "bold",
              marginTop: "10px",
              width: {
                xs: "100%",
                md: "200px",
              },
              "&:hover": {
                backgroundColor: "var(--color-button-primary-hover)",
              },
            }}
          >
            Salvar
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}
