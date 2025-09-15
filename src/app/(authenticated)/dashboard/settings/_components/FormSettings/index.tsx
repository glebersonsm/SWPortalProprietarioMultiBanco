"use client";
import CheckboxField from "@/components/CheckboxField";
import InputField from "@/components/InputField";
import { Framework, FrameworkSent } from "@/utils/types/framework";
import { Divider, Typography, Button, Stack, Grid, Box, Radio } from "@mui/joy";
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
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";

type FormSettingsProps = {
  settingsParams?: Framework;
};

export default function FormSettings({ settingsParams }: FormSettingsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm({
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
        Array.from({ length: 20 }, (_, i) => [
          `homeImageUrl${i + 1}`,
          settingsParams?.[`homeImageUrl${i + 1}` as keyof Framework] ??
            undefined,
        ])
      ),
    },
  });

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
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
      }
    );
  };

  return (
    <Box paddingBottom={"20px"} sx={{ flex: 1, overflow: "auto", padding: 2 }}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Stack gap={2}>
              <InputField
                label="Nome empreendimento"
                required={false}
                field="condominiumName"
              />
              <InputField
                label="Documento empreendimento"
                required={false}
                field="condominiumDocument"
              />
              <InputField
                label="Endereço empreendimento"
                required={false}
                field="condominiumAddress"
              />
              <InputField
                label="Nome adminstradora empreendimento"
                required={false}
                field="condominiumAdministratorName"
              />
              <InputField
                label="Documento admnistradora empreendimento"
                required={false}
                field="condominiumAdministratorDocument"
              />
              <InputField
                label="Endereço administradora empreendimento"
                required={false}
                field="condominiumAdministratorAddress"
              />

              <Divider />
              <InputField
                label="Site para reserva"
                required={false}
                field="websiteToBook"
              />
              <InputField
                label="Quantidade máxima de dias para exibição de contas à vencer (Aplicável apenas para clientes)"
                field="maxNumberOfDaysDueInvoices"
                type="number"
              />

              {/* <Divider />
              <RadioGroupField label="Integrado com" field="integratedWith">
                <Radio
                  value="integratedWithMultiOwnership"
                  label="Multipropriedade - Esolution"
                />

                <Radio
                  value="integratedWithTimeSharing"
                  label="Time Sharing - CM"
                />
              </RadioGroupField> */}

              {/* <Divider />
              <RadioGroupField
                label="Certidão por cliente"
                field="certificationByClient"
              >
                <Radio
                  value="groupCertificateByClient"
                  label="Agrupar certidão por cliente"
                />

                <Radio
                  value="issueCertificatePerClient"
                  label="Emitir certidão por contrato do cliente"
                />
              </RadioGroupField> */}

              <Divider />
              <Typography
                fontSize="sm"
                fontWeight={500}
                sx={{
                  color: "#171a1c",
                }}
              >
                Permissões
              </Typography>
              <CheckboxField
                label="Habilitar download de boleto"
                field="enableBillDownload"
              />
              <CheckboxField
                label="Habilitar pagamento online"
                field="enableOnlinePayment"
              />
              <CheckboxField
                label="Habilitar pagamento por pix"
                field="enablePixPayment"
              />
              <CheckboxField
                label="Habilitar pagamento por cartão"
                field="enableCardPayment"
              />
              <CheckboxField
                label="Mostrar contas vencidas"
                field="displayOverdueInvoices"
              />
              <InputField
                label="Exibir contas das Empresas (Ids separado por vírgula (,))"
                field="companyIds"
              />
              <CheckboxField
                label="Permitir usuário alterar seu documento"
                field="allowUserChangeYourDoc"
              />
              <CheckboxField
                label="Permitir usuário alterar seu email"
                field="allowUserChangeYourEmail"
              />
              <Divider />
              <Stack gap={1}>
                <Typography
                  fontSize="sm"
                  fontWeight={500}
                  sx={{
                    color: "#171a1c",
                  }}
                >
                  Imagens
                </Typography>
                <Typography
                  fontSize="xs"
                  fontWeight={400}
                  sx={{
                    color: "#171a1c",
                  }}
                >
                  *Obs: Utilizar imagens com resolução 1920 x 1080.
                </Typography>
              </Stack>

              <Stack gap={4}>
                <Accordion sx={{ bgcolor: "#035781" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      sx={{
                        color: "white",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Imagens Barretos Country
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack gap={1}>
                      <Typography
                        fontSize="xs"
                        sx={{
                          color: "white",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 400,
                        }}
                      ></Typography>
                    </Stack>

                    <Grid container spacing={2} sx={{ flexGrow: 1, mt: 1 }}>
                      {Array.from({ length: 10 }, (_, i) => (
                        <Grid key={i} xs={6} sm={2} xl={2}>
                          <PreviewImage
                            field={`homeImageUrl${i + 1}`}
                            initialImage={
                              typeof settingsParams?.[
                                `homeImageUrl${i + 1}` as keyof Framework
                              ] === "string"
                                ? (settingsParams?.[
                                    `homeImageUrl${i + 1}` as keyof Framework
                                  ] as string)
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
                    <Typography
                      sx={{
                        color: "white",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Imagens Serra Madre
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Stack gap={1}>
                      <Typography
                        fontSize="xs"
                        sx={{
                          color: "white",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 400,
                        }}
                      ></Typography>
                    </Stack>

                    <Grid container spacing={2} sx={{ flexGrow: 1, mt: 1 }}>
                      {Array.from({ length: 10 }, (_, i) => (
                        <Grid key={i + 10} xs={6} sm={2} xl={2}>
                          <PreviewImage
                            field={`homeImageUrl${i + 11}`}
                            initialImage={
                              typeof settingsParams?.[
                                `homeImageUrl${i + 11}` as keyof Framework
                              ] === "string"
                                ? (settingsParams?.[
                                    `homeImageUrl${i + 11}` as keyof Framework
                                  ] as string)
                                : undefined
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Stack>

              <Divider />
            </Stack>
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
    </Box>
  );
}
