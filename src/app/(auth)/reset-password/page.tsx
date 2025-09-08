"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import { formLabelClasses } from "@mui/joy/FormLabel";
import Stack from "@mui/joy/Stack";
import axios from "@/services/AxiosInstance";
import Link from "@/components/Link";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import AlertError from "../_components/AlertError";
import { toast } from "react-toastify";
import InputField from "@/components/InputField";
import { Typography } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/querys/users";
import { setFormErrors } from "@/services/errors/formErrors";
import { AxiosError } from "axios";
import LoadingData from "@/components/LoadingData";

type ResetPasswordValues = {
  login: string;
};

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const router = useRouter();
  const form = useForm<ResetPasswordValues>();

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setIsLoading(false);
    setIsSubmitted(false);
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não é possível resetar sua senha nesse momento, por favor tente mais tarde!",
    });
  };

  const handleResetPassword = useMutation({
    mutationFn: resetPassword,
    onError: onErrorHandler,
  });

  async function onSubmit(data: ResetPasswordValues) {
    setIsLoading(true);
    setIsSubmitted(true);
    try {
      const responseResetPassword = await axios.patch("/Usuario/resetpassword", {
        login: data.login,
      });
      const status = responseResetPassword.status;
      if (status === 200) {
        setIsLoading(false);
        toast.success(
          "Sua senha foi resetada com sucesso, por favor verifique seu e-mail"
        );
        router.push("/login");
      }
    } catch (error: any) {
      setIsLoading(false);
      setIsSubmitted(false);
      
      let errorMessage = "Não foi possível resetar a senha!";
      
      // Verifica se é um erro de conectividade (sem resposta do servidor)
      if (!error?.response) {
        errorMessage = "Sistema não está acessível no momento. Tente novamente mais tarde.";
      } else if (error?.response?.data?.errors?.[0]) {
        errorMessage = `Não foi possível resetar a senha! ${error.response.data.errors[0]}`;
      }
      
      toast.error(errorMessage);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        my: "auto",
        py: 2,
        pb: 5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 400,
        maxWidth: "100%",
        mx: "auto",
        borderRadius: "sm",
        "& form": {
          display: "flex",
          flexDirection: "column",
          gap: 2,
        },
        [`& .${formLabelClasses.asterisk}`]: {
          visibility: "hidden",
        },
      }}
    >
      <Typography
        level="h3"
        sx={{
          textAlign: "center",
          color: "var(--color-secondary)",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
        }}
      >
        Esqueci minha senha
      </Typography>

      <Stack gap={4} sx={{ mt: 2 }}>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isLoading ? (
              <LoadingData />
            ) : (
              <>
                <Typography
                  level="body-md"
                  sx={{
                    textAlign: "center",
                    color: "var(--color-primary)",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  Para resetar sua senha, por favor, informe o login da sua conta e
                  lhe enviaremos uma senha temporária no e-mail cadastrado.
                </Typography>

                <InputField label="Login" field="login" />

                <AlertError error={errors.root?.generalError?.message} />

                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Link
                      href="/login"
                      level="title-sm"
                      sx={{
                        color: "var(--color-primary)",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        "&:hover": {
                          color: "var(--color-secondary)",
                        },
                      }}
                    >
                      Já sei minha senha
                    </Link>
                  </Box>

                  <Button type="submit" fullWidth>
                    Resetar senha
                  </Button>
                </Stack>
              </>
            )}
          </form>
        </FormProvider>
      </Stack>
    </Box>
  );
}
