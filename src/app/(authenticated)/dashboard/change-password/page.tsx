"use client";

import AlertError from "@/app/(auth)/_components/AlertError";
import PasswordField from "@/components/PasswordField";
import useUser from "@/hooks/useUser";
import { setFormErrors } from "@/services/errors/formErrors";
import { changeUserPassword } from "@/services/querys/users";
import { ChangeUserPassword } from "@/utils/types/users";
import { Button, Stack } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const { userData } = useUser();
  const form = useForm<ChangeUserPassword>({});

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não é possível editar a senha do usuário nesse momento, por favor tente mais tarde!",
    });
  };

  const handleChangeUserPassword = useMutation({
    mutationFn: changeUserPassword,
    onError: onErrorHandler,
  });

  const handleLogout = () => {
    router.push(`/dashboard`);
  };

  function onSubmit(data: ChangeUserPassword) {
    handleChangeUserPassword.mutate(data, {
      onSuccess: () => {
        toast.success(
          `Senha do usuário ${userData?.name} alterada com sucesso!`
        );
        reset();
      },
    });
  }
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <PasswordField label="Senha atual" field="actualPassword" />
          <PasswordField label="Nova senha" field="newPassword" />
          <PasswordField
            label="Confirmação nova senha"
            field="newPasswordConfirmation"
          />
          <AlertError error={errors.root?.generalError?.message} />
          <Stack direction={"row"} spacing={2}>
            <Button
              variant="outlined"
              sx={{ width: { sm: "100px" } }}
              color="danger"
              onClick={handleLogout}
            >
              Sair
            </Button>
            <Button
              type="submit"
              sx={{
                width: { sm: "100px" },
                backgroundColor: "var(--color-button-primary)",
                color: "var(--color-button-text)",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                "&:hover": {
                  backgroundColor: "var(--color-button-primary-hover)",
                },
              }}
            >
              Salvar
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
}
