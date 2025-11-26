'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  listarVinculos,
  excluirVinculo,
  GatewayPagamentoVinculoDto,
} from '@/services/api/gatewayVinculoService';
import ReusableDataGrid from '@/components/ReusableDataGrid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Chip } from '@mui/material';
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
  const [activeTab, setActiveTab] = useState(0);
  const { settingsParams, isAdm } = useUser();
  const queryClient = useQueryClient();

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

  // Queries
  const { data: vinculos, isLoading: isLoadingVinculos, refetch: refetchVinculos } = useQuery({
    queryKey: ['gateway-vinculos'],
    queryFn: listarVinculos,
  });

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

  // Handlers para Vínculos
  const handleExcluirVinculo = async (id: number) => {
    if (!confirm('Deseja realmente excluir este vínculo?')) return;

    try {
      await excluirVinculo(id);
      toast.success('Vínculo excluído com sucesso!');
      refetchVinculos();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao excluir vínculo');
    }
  };

  const columnsVinculos: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      type: 'number',
    },
    {
      field: 'nomeEmpresa',
      headerName: 'Empresa',
      width: 130,
    },
    {
      field: 'nomeTorre',
      headerName: 'Torre',
      width: 130,
    },
    {
      field: 'gatewayNome',
      headerName: 'Gateway',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const isGetNet = params.value?.toLowerCase().includes('getnet');
        const isRede = params.value?.toLowerCase().includes('rede');
        const isPix = params.value?.toLowerCase().includes('pix');
        
        return (
          <Chip 
            label={params.value} 
            size="small" 
            color={isGetNet ? 'error' : isRede ? 'warning' : isPix ? 'success' : 'primary'}
          />
        );
      },
    },
    {
      field: 'configuracaoNome',
      headerName: 'Configuração',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'ativo',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Ativo' : 'Inativo'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'dataCriacao',
      headerName: 'Data Criação',
      width: 130,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? new Date(params.value).toLocaleDateString('pt-BR') : '-',
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" gap={1}>
          <JoyIconButton
            size="sm"
            color="primary"
            onClick={() =>
              router.push(`/dashboard/settings/financeiras/vinculo/${params.row.id}`)
            }
            title="Editar"
          >
            <EditIcon fontSize="small" />
          </JoyIconButton>
          <JoyIconButton
            size="sm"
            color="danger"
            onClick={() => handleExcluirVinculo(params.row.id)}
            title="Excluir"
          >
            <DeleteIcon fontSize="small" />
          </JoyIconButton>
        </Box>
      ),
    },
  ];

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
          value={activeTab}
          onChange={(_, value) => setActiveTab(value as number)}
          sx={{ width: "100%" }}
        >
          <TabList sx={{ mb: 2 }}>
            <Tab>Financeiro</Tab>
            <Tab>Pagamentos e boleto</Tab>
            <Tab>Configurações de Gateway</Tab>
            <Tab>Vínculos</Tab>
          </TabList>

          {/* Tab Panel: Financeiro */}
          <TabPanel value={0}>
            <Box paddingBottom={"20px"} sx={{ flex: 1, overflow: "auto", padding: 2 }}>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Stack spacing={3}>
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
                        <CheckboxField label="Habilitar pagamento por pix" field="enablePixPayment" />
                      </Grid>
                      <Grid xs={12} md={6}>
                        <CheckboxField label="Habilitar pagamento por cartão" field="enableCardPayment" />
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

          {/* Tab Panel: Configurações de Gateway */}
          <TabPanel value={2}>
            <Box paddingBottom={"20px"} sx={{ flex: 1, overflow: "auto", padding: 2 }}>
              <GatewayPagamentoListagemPage />
            </Box>
          </TabPanel>

          {/* Tab Panel: Vínculos */}
          <TabPanel value={3}>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="flex-end" alignItems="center">
                <JoyButton
                  startDecorator={<AddIcon />}
                  onClick={() => router.push('/dashboard/settings/financeiras/vinculo/novo')}
                >
                  Novo Vínculo
                </JoyButton>
              </Box>

              <Divider />

              <ReusableDataGrid
                rows={vinculos || []}
                columns={columnsVinculos}
                loading={isLoadingVinculos}
              />
            </Stack>
          </TabPanel>
        </Tabs>
      </Stack>
    </Box>
  );
}

