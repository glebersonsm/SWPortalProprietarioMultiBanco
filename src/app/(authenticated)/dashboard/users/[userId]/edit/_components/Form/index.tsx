"use client";

import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, FormLabel, Stack, Typography } from "@mui/joy";
import CheckboxField from "@/components/CheckboxField";
import { editUser } from "@/services/querys/users";
import TagsInput from "@/components/TagsInput";
import DynamicMultiForm from "@/components/DynamicMultiForm";
import DocumentFields from "../DocumentFields";
import AddressFields from "../AddressFields";
import PhoneFields from "../PhoneFields";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import AlertError from "@/app/(auth)/_components/AlertError";
import {
  DocumentTypes,
  AddressTypes,
  CompleteUser,
  CompleteUserSent,
  PhoneTypes,
} from "@/utils/types/users";
import { untransformedUsers } from "@/services/api/transformUsers";
import { AxiosError } from "axios";
import useUser from "@/hooks/useUser";
import ListCompanies from "@/components/ListCompanies";
import { Divider } from "@mui/material";

export type FormProps = {
  user: CompleteUser | undefined;
  phoneTypes: PhoneTypes[] | undefined;
  addressTypes: AddressTypes[] | undefined;
  documentTypes: DocumentTypes[] | undefined;
};

const buttonStyles = {
  marginTop: "10px",
  width: { xs: "100%", md: "200px" },
};

export default function EditForm({
  user,
  phoneTypes,
  addressTypes,
  documentTypes,
}: FormProps) {
  const { userData, refetchAuthUser, authUserCompany, settingsParams, isAdm } =
    useUser();
  const form = useForm<CompleteUserSent>({
    defaultValues: getDefaultValues(user),
  });
  const {
    formState: { errors },
    setError,
  } = form;
  const queryClient = useQueryClient();
  const redirectToUsers = useCloseModal(`/dashboard/users`);
  const redirectToHome = useCloseModal(`/dashboard`);
  const isAuthUser = userData?.id === user?.id;

  const handleEditUser = useMutation({
    mutationFn: editUser,
    onError: (error: AxiosError<{ errors?: string[] }>) =>
      handleFormError(error),
  });

  const dynamicForms = [
    {
      title: "Documentos",
      name: "documents",
      addButtonToolTip: "Adicionar documento",
      deleteButtonToolTip: "Remover documento",
      field: (index: number) => (
        <DocumentFields index={index} documentTypes={documentTypes} />
      ),
    },
    {
      title: "Endereços",
      name: "addresses",
      addButtonToolTip: "Adicionar endereço",
      deleteButtonToolTip: "Remover endereço",
      field: (index: number) => (
        <AddressFields index={index} addressTypes={addressTypes} />
      ),
    },
    {
      title: "Telefones",
      name: "phones",
      addButtonToolTip: "Adicionar telefone",
      deleteButtonToolTip: "Remover telefone",
      field: (index: number) => (
        <PhoneFields index={index} phoneTypes={phoneTypes} />
      ),
    },
  ];

  function getDefaultValues(user?: CompleteUser) {
    return {
      ...user,
      requiredTags: user?.requiredTags,
      name: user?.name,
      email: user?.email,
      documents: user?.documents,
      addresses: user?.addresses,
      phones: user?.phones,
      isAdm: user?.isAdm,
      isActive: user?.isActive,
      removeUnsetTags: false,
      companies: user?.companies,
      gestorFinanceiro: user?.gestorFinanceiro,
      gestorReservasAgendamentos: user?.gestorReservasAgendamentos,
    };
  }

  function handleFormError(error: AxiosError<{ errors?: string[] }>) {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não é possível editar o usuário nesse momento, por favor tente mais tarde!",
    });
  }

  function onSubmit(data: CompleteUserSent) {
    const changedSelectedCompany =
      data.companies?.some(
        (obj) => obj.companyId === authUserCompany?.companyId
      ) && data.removeUnsetCompanies;

    if (changedSelectedCompany && isAuthUser) {
      setError("root.generalError", {
        message:
          "Não é possível alterar o usuário, pois você está alterando uma empresa que está selecionada",
      });
      return;
    }

    handleEditUser.mutate(untransformedUsers(data), {
      onSuccess: () => handleSuccess(data.name),
    });
  }

  function handleSuccess(userName: string | undefined) {
    queryClient.invalidateQueries({ queryKey: ["getUsers"] });
    if (isAuthUser) refetchAuthUser();

    toast.success(`Usuário ${userName} editado com sucesso!`);
    isAdm ? redirectToUsers() : redirectToHome();
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {!isAdm && (
          <>
            <Stack gap={2}>
              <FormLabel
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "darkRed",
                }}
              >
                ***** Qualquer alteração cadastral deverá ser solicitada à
                Central de Atendimento aos Clientes *****
              </FormLabel>
            </Stack>
          </>
        )}
        <Stack spacing={3}>
          <InputField label="Nome" field="name" />

          <InputField
            label="Email"
            field="email"
            disabled={!isAdm && !settingsParams?.allowUserChangeYourEmail}
          />

          {isAdm && (
            <>
              <TagsInput />
              {user?.companies && (
                <>
                  <ListCompanies userCompanies={user.companies} />
                  <Divider />
                </>
              )}

              <Stack gap={2}>
                <FormLabel
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "primary.solidHoverBg",
                  }}
                >
                  Gerenciamento de acessos
                </FormLabel>
                <Divider />

                <CheckboxField label="Ativo" field="isActive" fontSize={14} />
                <Stack sx={{ display: "flex" }} flexDirection={"row"} gap={2}>
                  <CheckboxField
                    label="Administrador"
                    field="isAdm"
                    fontSize={14}
                  />
                  <CheckboxField
                    label="Gestão financeira"
                    field="gestorFinanceiro"
                    fontSize={14}
                  />
                  <CheckboxField
                    label="Getão de reservas e agendamentos"
                    field="gestorReservasAgendamentos"
                    fontSize={14}
                  />
                </Stack>
                <Divider />
              </Stack>
            </>
          )}

          {dynamicForms.map((formConfig, index) => (
            <DynamicMultiForm
              key={index}
              {...formConfig}
              capacity={0}
              isAdmin={isAdm}
            />
          ))}

          <AlertError error={errors.root?.generalError?.message} />
        </Stack>

        <Stack spacing={2} direction="row" justifyContent="flex-start">
          <Button
            variant="outlined"
            color="danger"
            sx={buttonStyles}
            onClick={isAdm ? redirectToUsers : redirectToHome}
          >
            Sair
          </Button>

          {isAdm && (
            <Button
              type="submit"
              sx={{
                ...buttonStyles,
                backgroundColor: "var(--color-button-primary)",
                color: "var(--color-button-text)",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "var(--color-button-primary-hover)",
                },
              }}
            >
              Salvar
            </Button>
          )}
        </Stack>
      </form>
    </FormProvider>
  );
}
