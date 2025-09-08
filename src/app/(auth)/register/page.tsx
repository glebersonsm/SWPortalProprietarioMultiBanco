"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import { formLabelClasses } from "@mui/joy/FormLabel";
import Stack from "@mui/joy/Stack";
import Link from "@/components/Link";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "@/services/AxiosInstance";
import AlertError from "../_components/AlertError";
import { toast } from "react-toastify";
import InputField from "@/components/InputField";
import PasswordField from "@/components/PasswordField";
import CpfOrCnpjInput from "@/components/CpfOrCnpjInput";
import { Typography } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import "../../../styles/global.css"

type RegisterValues = {
  fullName: string;
  cpfCnpj: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm({
    defaultValues: {
      fullName: "",
      cpfCnpj: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(data: RegisterValues) {
    setIsLoading(true);
    try {
      const response = await axios.post("/Auth/register", {
        ...data,
      });

      setIsLoading(false);
      toast.success("Registro efetuado com sucesso", { theme: "colored" });
      router.push("/login");
    } catch (error: any) {
      const status = error?.response?.status;
      let errorMessage = "Não é possível fazer o registro nesse momento, por favor tente mais tarde";
      
      // Verifica se é um erro de conectividade (sem resposta do servidor)
      if (!error?.response) {
        errorMessage = "Sistema não está acessível no momento. Tente novamente mais tarde.";
      } else if (error?.response?.data?.errors?.[1]) {
        errorMessage = error.response.data.errors[1];
      } else if (status === 500) {
        errorMessage = "Não é possível fazer o registro nesse momento, por favor tente mais tarde";
      }
      
      form.setError("root.generalError", {
        type: status,
        message: errorMessage,
      });
      setIsLoading(false);
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
      <Typography level="h3" sx={{ textAlign: "center", color: "var(--color-secondary)" }}>
        Registro
      </Typography>
      <Stack gap={4} sx={{ mt: 2 }}>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isLoading ? (
              <LoadingData />
            ) : (
              <>
                <InputField label="Nome" field="fullName" />
                <InputField label="Email" field="email" />
                <CpfOrCnpjInput
                  label="Documento"
                  field="cpfCnpj"
                  sx={{ color: "var(--color-secondary)" }}
                />
                <PasswordField
                  label="Senha"
                  field="password"
                  sx={{ color: "var(--color-secondary)" }}
                />
                <PasswordField
                  label="Confirmação de senha"
                  field="passwordConfirmation"
                  sx={{ color: "var(--color-secondary)" }}
                />
                <AlertError error={errors.root?.generalError?.message} />
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Link href="/login" level="title-sm" sx={{ color: "var(--color-primary)" }}>
                      Já tenho uma conta
                    </Link>
                  </Box>
                  <Button type="submit" fullWidth>
                    Registrar
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
