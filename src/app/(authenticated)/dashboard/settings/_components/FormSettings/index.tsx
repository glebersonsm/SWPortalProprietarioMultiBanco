"use client";
import CheckboxField from "@/components/CheckboxField";
import InputField from "@/components/InputField";
import { Framework, FrameworkSent } from "@/utils/types/framework";
import { Divider, Typography, Button, Stack, Grid, Box, Radio, Tabs, TabList, Tab, TabPanel, CircularProgress } from "@mui/joy";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { setFormErrors } from "@/services/errors/formErrors";
import { editFrameworkParams } from "@/services/querys/framework";
import { toast } from "react-toastify";
import { untransformedFrameworks } from "@/services/api/transformFrameworks";
import PreviewImage from "../PreviewImage";
import RadioGroupField from "@/components/RadioGroupField";
import { Accordion, AccordionDetails, AccordionSummary, useMediaQuery } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

type FormSettingsProps = {
  settingsParams?: Framework;
};

export default function FormSettings({ settingsParams }: FormSettingsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setIsLoading, setLoadingMessage } = useLoading();
  const isMobile = useMediaQuery("(max-width:900px)");

  const form = useForm<FrameworkSent>({
    defaultValues: {
      groupCertificateByClient:
        settingsParams?.groupCertificateByClient ?? false,
      issueCertificatePerClient:
        settingsParams?.issueCertificatePerClient ?? false,
      enableBillDownload: settingsParams?.enableBillDownload ?? false,
      enableOnlinePayment: settingsParams?.enableOnlinePayment ?? false,
      enablePixPayment: settingsParams?.enablePixPayment ?? false,
      enableCardPayment: settingsParams?.enableCardPayment ?? false,
      companyIds: settingsParams?.companyIds ?? "",
      ExibirFinanceiroPortalEmpresaIds:
        settingsParams?.ExibirFinanceiroPortalEmpresaIds ?? "",
      displayOverdueInvoices: settingsParams?.displayOverdueInvoices ?? false,
      maxNumberOfDaysDueInvoices: settingsParams?.maxNumberOfDaysDueInvoices,
      allowUserChangeYourEmail:
        settingsParams?.allowUserChangeYourEmail ?? false,
      allowUserChangeYourDoc: settingsParams?.allowUserChangeYourDoc ?? false,
      integratedWithMultiOwnership:
        settingsParams?.integratedWithMultiOwnership ?? false,
      integratedWithTimeSharing:
        settingsParams?.integratedWithTimeSharing ?? false,
      serverAddress: settingsParams?.serverAddress,
      websiteToBook: settingsParams?.websiteToBook,
      condominiumName: settingsParams?.condominiumName,
      condominiumDocument: settingsParams?.condominiumDocument,
      condominiumAddress: settingsParams?.condominiumAddress,
      condominiumAdministratorName:
        settingsParams?.condominiumAdministratorName,
      condominiumAdministratorDocument:
        settingsParams?.condominiumAdministratorDocument,
      condominiumAdministratorAddress:
        settingsParams?.condominiumAdministratorAddress,
      certificationByClient: settingsParams?.groupCertificateByClient
        ? "groupCertificateByClient"
        : "issueCertificatePerClient",
      integratedWith: settingsParams?.integratedWithMultiOwnership
        ? "integratedWithMultiOwnership"
        : "integratedWithTimeSharing",

      // 👇 Adiciona automaticamente homeImageUrl1 até homeImageUrl20
      ...Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => {
          const key = `homeImageUrl${i + 1}` as keyof Framework;
          const val = settingsParams?.[key];
          return [
            `homeImageUrl${i + 1}`,
            typeof val === "string" ? val : undefined,
          ];
        })
      ),
    },
  });

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setIsLoading(false);
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não é possível editar as configurações nesse mommento, por favor tente mais tarde!",
    });
  };

  const handleEditSettingsParams = useMutation({
    mutationFn: editFrameworkParams,
    onError: onErrorHandler,
  });

  function normalizeHomeImages(data: any) {
    const imageFields = Array.from(
      { length: 20 },
      (_, i) => `homeImageUrl${i + 1}`
    );

    const validImages = imageFields
      .map((field) => data[field])
      .filter((value) => value !== null && value !== undefined && value !== "");

    const normalizedImages: Record<string, string | File> = {};
    validImages.forEach((image, index) => {
      normalizedImages[`homeImageUrl${index + 1}`] = image;
    });

    return normalizedImages;
  }

  const onSubmit = async (data: FrameworkSent) => {
    const normalizedImages = normalizeHomeImages(data);
    setLoadingMessage("Salvando configurações...");
    setIsLoading(true);

    handleEditSettingsParams.mutate(
      untransformedFrameworks({
        ...data,
        ...normalizedImages,
        id: settingsParams?.id,
        groupCertificateByClient:
          data.certificationByClient === "groupCertificateByClient",
        issueCertificatePerClient:
          data.certificationByClient === "issueCertificatePerClient",
        integratedWithMultiOwnership: true,

        // integratedWithMultiOwnership:
        //   data.integratedWith === "integratedWithMultiOwnership",

        // integratedWithTimeSharing:
        //   data.integratedWith === "integratedWithTimeSharing",
      }),
      {
        onSuccess: async () => {
          queryClient.invalidateQueries({ queryKey: ["getAuthUser"] });
          toast.success(`Configurações editadas com sucesso!`);
          router.push("/dashboard");
        },
        onError: () => {
          setIsLoading(false);
        },
        onSettled: () => {
          // Caso não haja navegação, garante que o loading não fique preso
          // A navegação padrão irá limpar o loading via useNavigationLoading
        },
      }
    );
  };

  const EmpreendimentoSection = () => (
    <Stack gap={2}>
      <Grid container spacing={{ xs: 1.5, md: 2 }}>
        <Grid xs={12} md={6}>
          <InputField label="Nome empreendimento" required={false} field="condominiumName" />
        </Grid>
        <Grid xs={12} md={6}>
          <InputField label="Documento empreendimento" required={false} field="condominiumDocument" />
        </Grid>
        <Grid xs={12}>
          <InputField label="Endereço empreendimento" required={false} field="condominiumAddress" />
        </Grid>
      </Grid>

      <Typography fontSize="sm" fontWeight={600} sx={{ color: "#171a1c", mt: 2 }}>
        Administradora do empreendimento
      </Typography>
      <Grid container spacing={{ xs: 1.5, md: 2 }}>
        <Grid xs={12} md={6}>
          <InputField label="Nome adminstradora empreendimento" required={false} field="condominiumAdministratorName" />
        </Grid>
        <Grid xs={12} md={6}>
          <InputField label="Documento admnistradora empreendimento" required={false} field="condominiumAdministratorDocument" />
        </Grid>
        <Grid xs={12}>
          <InputField label="Endereço administradora empreendimento" required={false} field="condominiumAdministratorAddress" />
        </Grid>
      </Grid>
    </Stack>
  );

  const FinanceiroSection = () => (
    <Grid container spacing={{ xs: 1.5, md: 2 }}>
      <Grid xs={12} md={6}>
        <InputField label="Quantidade máxima de dias para exibição de contas à vencer (Aplicável apenas para clientes)" field="maxNumberOfDaysDueInvoices" type="number" />
      </Grid>
      <Grid xs={12} md={6}>
        <CheckboxField label="Mostrar contas vencidas" field="displayOverdueInvoices" />
      </Grid>
      <Grid xs={12}>
        <InputField label="Exibir contas das Empresas (Ids separado por vírgula (,))" field="companyIds" />
      </Grid>
      <Grid xs={12}>
        <InputField label="Ids de empresas do ePortal (Ids separado por vírgula (,))" field="ExibirFinanceiroPortalEmpresaIds" />
      </Grid>
    </Grid>
  );

  const PagamentosSection = () => (
    <Grid container spacing={{ xs: 1.5, md: 2 }}>
      <Grid xs={12} md={6}>
        <CheckboxField label="Habilitar download de boleto" field="enableBillDownload" />
      </Grid>
      <Grid xs={12} md={6}>
        <CheckboxField label="Habilitar pagamento online" field="enableOnlinePayment" />
      </Grid>
      <Grid xs={12} md={6}>
        <CheckboxField label="Habilitar pagamento por pix" field="enablePixPayment" />
      </Grid>
      <Grid xs={12} md={6}>
        <CheckboxField label="Habilitar pagamento por cartão" field="enableCardPayment" />
      </Grid>
    </Grid>
  );

  const UsuarioSection = () => (
    <Grid container spacing={{ xs: 1.5, md: 2 }}>
      <Grid xs={12} md={6}>
        <CheckboxField label="Permitir usuário alterar seu documento" field="allowUserChangeYourDoc" />
      </Grid>
      <Grid xs={12} md={6}>
        <CheckboxField label="Permitir usuário alterar seu email" field="allowUserChangeYourEmail" />
      </Grid>
    </Grid>
  );

  const ImagensSection = () => (
    <>
      <Stack gap={1}>
        <Typography fontSize="xs" fontWeight={400} sx={{ color: "#171a1c" }}>
          *Obs: Utilizar imagens com resolução 1920 x 1080.
        </Typography>
      </Stack>

      <Stack gap={4}>
        <Accordion sx={{ bgcolor: "#035781" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
            <Typography sx={{ color: "white", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              Imagens Barretos Country
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack gap={1}>
              <Typography fontSize="xs" sx={{ color: "white", fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}></Typography>
            </Stack>

            <Grid container spacing={{ xs: 1, md: 2 }} sx={{ flexGrow: 1, mt: 1 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <Grid key={i} xs={6} sm={2} xl={2}>
                  <PreviewImage
                    field={`homeImageUrl${i + 1}`}
                    initialImage={
                      typeof settingsParams?.[`homeImageUrl${i + 1}` as keyof Framework] === "string"
                        ? (settingsParams?.[`homeImageUrl${i + 1}` as keyof Framework] as string)
                        : undefined
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ bgcolor: "#035781", color: "white" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
            <Typography sx={{ color: "white", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              Imagens Serra Madre
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Stack gap={1}>
              <Typography fontSize="xs" sx={{ color: "white", fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}></Typography>
            </Stack>

            <Grid container spacing={{ xs: 1, md: 2 }} sx={{ flexGrow: 1, mt: 1 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <Grid key={i + 10} xs={6} sm={2} xl={2}>
                  <PreviewImage
                    field={`homeImageUrl${i + 11}`}
                    initialImage={
                      typeof settingsParams?.[`homeImageUrl${i + 11}` as keyof Framework] === "string"
                        ? (settingsParams?.[`homeImageUrl${i + 11}` as keyof Framework] as string)
                        : undefined
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </>
  );

  return (
    <Box
      paddingBottom={"20px"}
      sx={{
        flex: 1,
        overflow: "auto",
        px: { xs: 1.5, md: 2 },
        py: { xs: 1.5, md: 2 },
        backgroundColor: "background.body",
      }}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={{ xs: 2, md: 3 }}>
            {isMobile ? (
              <Stack spacing={{ xs: 2, md: 3 }}>
                <Typography fontSize="sm" sx={{ fontWeight: 600, color: "#171a1c" }}>Empreendimento</Typography>
                <EmpreendimentoSection />
                <Divider />

                <Typography fontSize="sm" sx={{ fontWeight: 600, color: "#171a1c" }}>Financeiro</Typography>
                <FinanceiroSection />
                <Divider />

                <Typography fontSize="sm" sx={{ fontWeight: 600, color: "#171a1c" }}>Pagamentos e boleto</Typography>
                <PagamentosSection />
                <Divider />

                <Typography fontSize="sm" sx={{ fontWeight: 600, color: "#171a1c" }}>Configurações do usuário</Typography>
                <UsuarioSection />
                <Divider />

                <Typography fontSize="sm" sx={{ fontWeight: 600, color: "#171a1c" }}>Imagens Home</Typography>
                <ImagensSection />
              </Stack>
            ) : (
              <Tabs defaultValue="empreendimento">
                <TabList
                  sx={{
                    overflowX: "auto",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    bgcolor: "background.surface",
                    borderBottom: "1px solid",
                    borderColor: "neutral.outlinedBorder",
                    px: { xs: 1, md: 2 },
                    py: { xs: 0.5, md: 1 },
                    gap: 1,
                  }}
                >
                  <Tab value="empreendimento">Empreendimento</Tab>
                  {/* <Tab value="integracoes">Integrações e reserva</Tab> */}
                  <Tab value="financeiro">Financeiro</Tab>
                  <Tab value="pagamentos">Pagamentos e boleto</Tab>
                  <Tab value="usuario">Configurações do usuário</Tab>
                  <Tab value="imagens">Imagens Home</Tab>
                </TabList>

                <TabPanel value="empreendimento">
                  <EmpreendimentoSection />
                </TabPanel>

                <TabPanel value="financeiro">
                  <FinanceiroSection />
                </TabPanel>

                <TabPanel value="pagamentos">
                  <PagamentosSection />
                </TabPanel>

                <TabPanel value="usuario">
                  <UsuarioSection />
                </TabPanel>

                <TabPanel value="imagens">
                  <ImagensSection />
                </TabPanel>
              </Tabs>
            )}
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 20,
                bgcolor: "background.surface",
                borderTop: "1px solid",
                borderColor: "neutral.outlinedBorder",
                px: { xs: 1.5, md: 2 },
                py: { xs: 1, md: 1.5 },
              }}
            >
              <Button
                type="submit"
                sx={{
                  backgroundColor: "var(--color-button-primary)",
                  color: "var(--color-button-text)",
                  fontWeight: "bold",
                  width: {
                    xs: "100%",
                    md: "200px",
                  },
                  "&:hover": {
                    backgroundColor: "var(--color-button-primary-hover)",
                  },
                }}
                disabled={handleEditSettingsParams.isPending}
                startDecorator={
                  handleEditSettingsParams.isPending ? (
                    <CircularProgress
                      size="sm"
                      sx={{
                        "--CircularProgress-trackColor": "transparent",
                        "--CircularProgress-progressColor": "var(--CircularProgress-Color)",
                      }}
                    />
                  ) : undefined
                }
              >
                Salvar
              </Button>
            </Box>
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
}
