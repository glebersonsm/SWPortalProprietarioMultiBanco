"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Link from "@/components/Link";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { FormProvider, useForm } from "react-hook-form";
import axios from "@/services/AxiosInstance";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import AlertError from "../_components/AlertError";
import InputField from "@/components/InputField";
import PasswordField from "@/components/PasswordField";
import useUser from "@/hooks/useUser";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import LoadingData from "@/components/LoadingData";
import "@/styles/global.css";

type LoginValues = {
  login: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { refetchAuthUser } = useUser({ isSubmitted });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("padraoDeCor", "Default");
      const existingLink = document.getElementById("theme-css");
      if (existingLink) existingLink.remove();

      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  function clearSession() {
    queryClient.clear();
    if (typeof window !== "undefined") localStorage.clear();
    removeCookie("sessionId");
    removeCookie("authToken");
    removeCookie("userLogin");
  }

  const form = useForm<LoginValues>({
    defaultValues: { login: "", password: "" },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(data: LoginValues) {
    clearSession();
    setIsSubmitted(true);
    setIsLoading(true);

   
      try {
        clearSession();
        const responseLogin = await axios.post("/Auth/login", {
          login: data.login,
          senha: data.password,
        });

        const {
          token,
          login,
          idioma,
          podeInformarPix,
          podeInformarConta,
          padraoDeCor,
        } = responseLogin.data.data;

        const sessionId = Date.now().toString();
        setCookie("sessionId", sessionId);
        setCookie("authToken", token);
        setCookie("userLogin", login);

        await new Promise((res) => setTimeout(res, 150));

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "info_user_pix_conta_idioma",
            JSON.stringify({ idioma, podeInformarPix, podeInformarConta })
          );
          localStorage.setItem("authToken", token);
          localStorage.setItem("padraoDeCor", padraoDeCor || "Default");

          if (padraoDeCor?.toLowerCase() === "black") {
            const existing = document.getElementById(
              "theme-css"
            ) as HTMLLinkElement | null;
            if (existing) {
              existing.href = "/styles/theme-black.css";
            } else {
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.id = "theme-css";
              link.href = "/styles/theme-black.css";
              document.head.appendChild(link);
            }
          }
        }

        if (
          sessionId !== undefined &&
          token !== undefined &&
          login !== undefined &&
          getCookie("userLogin") === login &&
          responseLogin?.data?.errors?.length === 0
        ) {
          // Aguarda o refetch dos dados do usuário antes de redirecionar
          await refetchAuthUser();
          router.push(`/dashboard`);
          setIsLoading(false);
        } 
      } catch (error: any) {
        const status = error?.response?.status;
        clearSession();
        setIsLoading(false);
        
        let errorMessage = "Usuário ou senha inválidos";
        
        // Verifica se é um erro de conectividade (sem resposta do servidor)
        if (!error?.response) {
          errorMessage = "Sistema não está acessível no momento. Tente novamente mais tarde.";
        } else if (error?.response?.data?.errors?.[0]) {
          errorMessage = error.response.data.errors[0];
        }
        
        form.setError("root.generalError", {
          type: status,
          message: errorMessage,
        });
      }
      
    setIsSubmitted(false);
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
        bgcolor: "var(--login-card-bg)",
        color: "var(--login-card-fg)",
        boxShadow: "var(--elevation-2)",
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
        Seja bem-vindo!
      </Typography>

      <Stack gap={4} sx={{ mt: 2 }}>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LoadingData />
                <Typography level="body-sm" sx={{ mt: 2, color: 'var(--color-secondary)' }}>
                  {isSubmitted ? 'Validando credenciais...' : 'Carregando...'}
                </Typography>
              </Box>
            ) : (
              <>
                <InputField
                  label="Usuário"
                  field="login"
                  colorLabel="var(--color-secondary)"
                  sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
                />
                <PasswordField
                  label="Senha"
                  field="password"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    color: "var(--color-secondary)",
                  }}
                />
                <AlertError error={errors.root?.generalError?.message} />
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Link
                      href="/register"
                      level="title-sm"
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        "&:hover": { color: "var(--color-primary)" },
                      }}
                    >
                      Meu primeiro acesso
                    </Link>
                    <Link
                      href="/reset-password"
                      level="title-sm"
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        "&:hover": { color: "var(--color-primary)" },
                      }}
                    >
                      Esqueci minha senha
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      bgcolor: "var(--color-primary)",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 500,
                      transition: "0.6s",
                      "&:hover": { bgcolor: "var(--color-secondary)" },
                    }}
                  >
                    Login
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
