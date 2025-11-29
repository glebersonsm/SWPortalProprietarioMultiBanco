'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Stack, 
  Divider, 
  Button as JoyButton, 
  IconButton as JoyIconButton,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Typography,
  Grid,
} from '@mui/joy';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import CheckboxField from "@/components/CheckboxField";
import InputField from "@/components/InputField";
import { Framework, FrameworkSent } from "@/utils/types/framework";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { setFormErrors } from "@/services/errors/formErrors";
import { editFrameworkParams } from "@/services/querys/framework";
import { untransformedFrameworks } from "@/services/api/transformFrameworks";
import useUser from "@/hooks/useUser";
import GatewayPagamentoListagemPage from "./gateway-pagamento/page";

export default function FinanceirasSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const t = searchParams.get('tab');
    const n = t ? Number(t) : 0;
    return Number.isFinite(n) && n >= 0 && n <= 2 ? n : 0;
  });
  const { settingsParams, isAdm } = useUser();
  const queryClient = useQueryClient();
  const [formHydrated, setFormHydrated] = useState(false);

  // Form para abas Financeiro e Pagamentos
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
      ExibirFinanceiroPortalEmpresaIds: settingsParams?.ExibirFinanceiroPortalEmpresaIds ?? "",
      displayOverdueInvoices: settingsParams?.displayOverdueInvoices ?? false,
      maxNumberOfDaysDueInvoices: settingsParams?.maxNumberOfDaysDueInvoices,
      allowUserChangeYourEmail:
        settingsParams?.allowUserChangeYourEmail ?? false,
      allowUserChangeYourDoc: settingsParams?.allowUserChangeYourDoc ?? false,
      integratedWithMultiOwnership:
        settingsParams?.integratedWithMultiOwnership ?? false,
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
      integratedWith: "integratedWithMultiOwnership",
    },
  });

  useEffect(() => {
    if (!settingsParams) return;
    form.reset({
      groupCertificateByClient: settingsParams.groupCertificateByClient ?? false,
      issueCertificatePerClient: settingsParams.issueCertificatePerClient ?? false,
      enableBillDownload: settingsParams.enableBillDownload ?? false,
      enableOnlinePayment: settingsParams.enableOnlinePayment ?? false,
      enablePixPayment: settingsParams.enablePixPayment ?? false,
      enableCardPayment: settingsParams.enableCardPayment ?? false,
      companyIds: settingsParams.companyIds ?? "",
      ExibirFinanceiroPortalEmpresaIds: settingsParams.ExibirFinanceiroPortalEmpresaIds ?? "",
      displayOverdueInvoices: settingsParams.displayOverdueInvoices ?? false,
      maxNumberOfDaysDueInvoices: settingsParams.maxNumberOfDaysDueInvoices,
      allowUserChangeYourEmail: settingsParams.allowUserChangeYourEmail ?? false,
      allowUserChangeYourDoc: settingsParams.allowUserChangeYourDoc ?? false,
      integratedWithMultiOwnership: settingsParams.integratedWithMultiOwnership ?? false,
      serverAddress: settingsParams.serverAddress,
      websiteToBook: settingsParams.websiteToBook,
      condominiumName: settingsParams.condominiumName,
      condominiumDocument: settingsParams.condominiumDocument,
      condominiumAddress: settingsParams.condominiumAddress,
      condominiumAdministratorName: settingsParams.condominiumAdministratorName,
      condominiumAdministratorDocument: settingsParams.condominiumAdministratorDocument,
      condominiumAdministratorAddress: settingsParams.condominiumAdministratorAddress,
      certificationByClient: settingsParams.groupCertificateByClient ? "groupCertificateByClient" : "issueCertificatePerClient",
      integratedWith: "integratedWithMultiOwnership",
    });
    setFormHydrated(true);
  }, [settingsParams, form]);

  // Queries
  

  // Handlers para Form Financeiro
  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não é possível editar as configurações nesse momento, por favor tente mais tarde!",
    });
  };

  const handleEditSettingsParams = useMutation({
    mutationFn: editFrameworkParams,
    onError: onErrorHandler,
  });

  const onSubmit = async (data: FrameworkSent) => {
    handleEditSettingsParams.mutate(
      untransformedFrameworks({
        ...data,
        id: settingsParams?.id,
        groupCertificateByClient:
          data.certificationByClient === "groupCertificateByClient",
        issueCertificatePerClient:
          data.certificationByClient === "issueCertificatePerClient",
        integratedWithMultiOwnership: true,
      }),
      {
        onSuccess: async () => {
          queryClient.invalidateQueries({ queryKey: ["getAuthUser"] });
          toast.success(`Configurações editadas com sucesso!`);
        },
      }
    );
  };

  const onlineEnabled = !!form.watch('enableOnlinePayment');
  const safeActiveTab = onlineEnabled ? activeTab : activeTab > 1 ? 1 : activeTab;

  useEffect(() => {
    if (!formHydrated) return;
    if (!onlineEnabled) {
      form.setValue('enablePixPayment', false);
      form.setValue('enableCardPayment', false);
    }
  }, [onlineEnabled, form, formHydrated]);

  

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <JoyButton
            variant="outlined"
            startDecorator={<ArrowBackIcon />}
            onClick={() => router.push("/dashboard/settings")}
          >
            Voltar
          </JoyButton>
          <Typography
            level="h4"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Financeiras
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={safeActiveTab}
          onChange={(_, value) => setActiveTab(value as number)}
          sx={{ width: "100%" }}
        >
          <TabList sx={{ mb: 2 }}>
            <Tab>Financeiro</Tab>
            <Tab>Pagamentos e boleto</Tab>
            {onlineEnabled && <Tab>Configurações de Gateway</Tab>}
          </TabList>

          {/* Tab Panel: Financeiro */}
          <TabPanel value={0}>
            <Box paddingBottom={"20px"} sx={{ flex: 1, overflow: "auto", padding: 2 }}>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Stack spacing={3}>
                    <Grid container spacing={{ xs: 1.5, md: 2 }}>
                      <Grid xs={12} md={12}>
                        <CheckboxField label="Mostrar contas vencidas" field="displayOverdueInvoices" />
                      </Grid>
                      <Grid xs={12} md={12}>
                        <InputField label="Quantidade máxima de dias para exibição de contas à vencer (Aplicável apenas para clientes)" field="maxNumberOfDaysDueInvoices" type="number" />
                      </Grid>
                      <Grid xs={12} md={12}>
                        <InputField label="Exibir contas das Empresas (Ids separado por vírgula (,))" field="companyIds" />
                      </Grid>
                      <Grid xs={12} md={12}>
                        <InputField label="Ids de empresas do ePortal (Ids separado por vírgula (,))" field="ExibirFinanceiroPortalEmpresaIds" />
                      </Grid>
                    </Grid>
                    <JoyButton
                      type="submit"
                      disabled={handleEditSettingsParams.isPending}
                      loading={handleEditSettingsParams.isPending}
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
                    </JoyButton>
                  </Stack>
                </form>
              </FormProvider>
            </Box>
          </TabPanel>

          {/* Tab Panel: Pagamentos e boleto */}
          <TabPanel value={1}>
            <Box paddingBottom={"20px"} sx={{ flex: 1, overflow: "auto", padding: 2 }}>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Stack spacing={3}>
                    <Grid container spacing={{ xs: 1.5, md: 2 }}>
                      <Grid xs={12} md={6}>
                        <CheckboxField label="Habilitar download de boleto" field="enableBillDownload" />
                      </Grid>
                      <Grid xs={12} md={6}>
                        <CheckboxField label="Habilitar pagamento online" field="enableOnlinePayment" />
                      </Grid>
                      <Grid xs={12} md={6}>
                        <CheckboxField label="Habilitar pagamento por pix" field="enablePixPayment" disabled={!onlineEnabled} />
                      </Grid>
                      <Grid xs={12} md={6}>
                        <CheckboxField label="Habilitar pagamento por cartão" field="enableCardPayment" disabled={!onlineEnabled} />
                      </Grid>
                    </Grid>
                    <JoyButton
                      type="submit"
                      disabled={handleEditSettingsParams.isPending}
                      loading={handleEditSettingsParams.isPending}
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
                    </JoyButton>
                  </Stack>
                </form>
              </FormProvider>
            </Box>
          </TabPanel>

          {onlineEnabled && (
            <TabPanel value={2}>
              <Box paddingBottom={"20px"} sx={{ flex: 1, overflow: "auto", padding: 2 }}>
                <GatewayPagamentoListagemPage />
              </Box>
            </TabPanel>
          )}

          
        </Tabs>
      </Stack>
    </Box>
  );
}

