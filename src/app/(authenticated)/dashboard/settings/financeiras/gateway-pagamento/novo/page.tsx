'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Stack,
  Divider,
  Button as JoyButton,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Select,
  Option,
  Textarea,
  Typography,
  IconButton,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Chip,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Grid,
  CircularProgress,
} from '@mui/joy';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff,
  Home as HomeIcon,
  Add as AddIcon,
  CreditCard as CreditCardIcon,
  Pix as PixIcon,
  CloudUpload as UploadIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import {
  criar,
  listarGateways,
  uploadCertificadoPix,
  listarContasFinanceiras,
  ContaFinanceiraDto,
  GatewayPagamentoDto,
  GatewayPagamentoConfiguracaoDto,
} from '@/services/api/gatewayPagamentoService';
import { toast } from 'react-toastify';
import LoadingData from '@/components/LoadingData';
import { useQuery } from '@tanstack/react-query';
import { getEmpresasVinculadas } from '@/services/querys/framework';

export default function NovaConfiguracaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  type TabKey = 'general' | 'credentials' | 'certificate' | 'notes';
  const [tabIndex, setTabIndex] = useState<TabKey>('general');

  // Carregar empresas vinculadas
  const { data: empresas } = useQuery({
    queryKey: ["GetEmpresasVinculadas"],
    queryFn: () => getEmpresasVinculadas(),
  });

  // Carregar gateways
  const { data: gateways = [], isLoading: loadingGateways } = useQuery({
    queryKey: ["listarGateways"],
    queryFn: () => listarGateways(),
  });
  
  const [formData, setFormData] = useState<GatewayPagamentoConfiguracaoDto>({
    gatewayPagamentoId: 0,
    nomeExibicao: '',
    identificador: '',
    ativo: true,
    clientId: '',
    clientSecret: '',
    sellerId: '',
    pv: '',
    token: '',
    observacao: '',
    chavePix: '',
    itauClientId: '',
    itauClientSecret: '',
    santanderClientId: '',
    santanderClientSecret: '',
    getNetPixClientId: '',
    getNetPixClientSecret: '',
    getNetPixSellerId: '',
    certificadoPixConfigurado: false,
    contaFinanceiraVariacaoId: undefined,
  });

  const [gatewaySelected, setGatewaySelected] = useState<string>('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(null);
  const [contasFinanceiras, setContasFinanceiras] = useState<ContaFinanceiraDto[]>([]);
  const [showPV, setShowPV] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showClientId, setShowClientId] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showSellerId, setShowSellerId] = useState(false);
  const [showItauClientId, setShowItauClientId] = useState(false);
  const [showItauClientSecret, setShowItauClientSecret] = useState(false);
  const [showSantanderClientId, setShowSantanderClientId] = useState(false);
  const [showSantanderClientSecret, setShowSantanderClientSecret] = useState(false);
  const [showGetNetPixClientId, setShowGetNetPixClientId] = useState(false);
  const [showGetNetPixClientSecret, setShowGetNetPixClientSecret] = useState(false);
  const [certificadoFile, setCertificadoFile] = useState<File | null>(null);
  const [certificadoSenha, setCertificadoSenha] = useState('');

  const tabListStyles = {
    borderRadius: '14px',
    p: 0.5,
    bgcolor: 'rgba(0, 200, 236, 0.12)',
    boxShadow: 'inset 0 0 0 1px rgba(1, 90, 103, 0.18)'
  };

  const tabItemStyles = {
    fontWeight: 600,
    borderRadius: '10px',
    color: 'var(--color-primary)',
    '&.Mui-selected': {
      bgcolor: 'var(--color-primary)',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(1, 90, 103, 0.25)'
    },
    '&.Mui-disabled': {
      color: 'rgba(1, 90, 103, 0.45)'
    },
    '&:hover': {
      bgcolor: 'rgba(0, 200, 236, 0.15)'
    }
  } as const;

  const sectionCardStyles = {
    borderRadius: '16px',
    border: '1px solid rgba(1, 90, 103, 0.22)',
    background: 'linear-gradient(135deg, rgba(1, 90, 103, 0.08) 0%, rgba(0, 200, 236, 0.12) 100%)',
    boxShadow: '0 10px 24px rgba(1, 90, 103, 0.12)',
    '--Card-padding': '24px'
  };

  const brandAlertStyles = {
    bgcolor: 'rgba(0, 200, 236, 0.15)',
    border: '1px solid rgba(1, 90, 103, 0.24)',
    color: 'var(--color-primary)',
    borderRadius: '12px',
    alignItems: 'flex-start'
  };

  const chipStyles = {
    bgcolor: 'var(--color-primary)',
    color: '#ffffff',
    fontWeight: 600,
    '& .MuiChip-startDecorator svg': {
      color: '#ffffff'
    }
  } as const;

  const fileInputStyles = {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    '& input[type="file"]': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer',
      zIndex: 1,
    },
    '& .file-input-button': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      padding: '12px 24px',
      borderRadius: '12px',
      border: '2px dashed rgba(0, 200, 236, 0.4)',
      background: 'linear-gradient(135deg, rgba(0, 200, 236, 0.08) 0%, rgba(1, 90, 103, 0.12) 100%)',
      color: 'var(--color-primary)',
      fontWeight: 600,
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        borderColor: 'var(--color-primary)',
        background: 'linear-gradient(135deg, rgba(0, 200, 236, 0.15) 0%, rgba(1, 90, 103, 0.18) 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 200, 236, 0.2)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
      '& svg': {
        fontSize: '24px',
      },
    },
  } as const;

  useEffect(() => {
    // Se não for PIX, não mostrar aba de certificado
    const isPixGateway =
      gatewaySelected === 'GATEWAY_PAGAMENTO_ITAU_PIX' ||
      gatewaySelected === 'GATEWAY_PAGAMENTO_SANTANDER_PIX' ||
      gatewaySelected === 'GATEWAY_PAGAMENTO_GETNET_PIX';

    if (!isPixGateway && tabIndex === 'certificate') {
      setTabIndex('credentials');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewaySelected]);

  useEffect(() => {
    if (empresaSelecionada) {
      listarContasFinanceiras(empresaSelecionada)
        .then(setContasFinanceiras)
        .catch((err) => {
          console.error(err);
          toast.error('Erro ao carregar contas financeiras');
        });
    } else {
      setContasFinanceiras([]);
    }
  }, [empresaSelecionada]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gatewayPagamentoId) {
      toast.error('Selecione um gateway');
      setTabIndex('general');
      return;
    }

    if (!formData.nomeExibicao) {
      toast.error('Informe o nome de exibição');
      setTabIndex('general');
      return;
    }

    if (!formData.identificador) {
      toast.error('Selecione a empresa');
      setTabIndex('general');
      return;
    }

    // Validações específicas por gateway
    if (isAnyPix) {
      if (!formData.chavePix) {
        toast.error('Informe a chave PIX');
        setTabIndex('credentials');
        return;
      }

      if (isItauPix) {
        if (!formData.itauClientId || !formData.itauClientSecret) {
          toast.error('Preencha Client ID e Client Secret do Itaú');
          setTabIndex('credentials');
          return;
        }
      }

      if (isSantanderPix) {
        if (!formData.santanderClientId || !formData.santanderClientSecret) {
          toast.error('Preencha Client ID e Client Secret do Santander');
          setTabIndex('credentials');
          return;
        }
      }

      const isGetNetPix = gatewaySelected === 'GATEWAY_PAGAMENTO_GETNET_PIX';
      if (isGetNetPix) {
        if (!formData.getNetPixClientId || !formData.getNetPixClientSecret || !formData.getNetPixSellerId) {
          toast.error('Preencha Client ID, Client Secret e Seller ID do GetNet PIX');
          setTabIndex('credentials');
          return;
        }
      }

      // Certificado não é obrigatório para GetNet PIX
      if (!isGetNetPix && !certificadoFile) {
        toast.error('É necessário enviar um certificado digital para PIX');
        setTabIndex('certificate');
        return;
      }

      if (certificadoFile && !certificadoSenha) {
        toast.error('Informe a senha do certificado');
        setTabIndex('certificate');
        return;
      }
    } else if (isGetNet) {
      if (!formData.clientId || !formData.clientSecret || !formData.sellerId) {
        toast.error('Preencha todos os campos obrigatórios de credenciais GetNet');
        setTabIndex('credentials');
        return;
      }
    } else if (isRede) {
      if (!formData.pv || !formData.token) {
        toast.error('Preencha todos os campos obrigatórios de credenciais e.Rede');
        setTabIndex('credentials');
        return;
      }
    }

    try {
      setLoading(true);
      
      const gateway = gateways.find(g => g.id === formData.gatewayPagamentoId);
      const dadosCompletos = {
        ...formData,
        gatewaySysId: gateway?.sysId,
        gatewayDescricao: gateway?.descricao,
      };
      
      const resultado = await criar(dadosCompletos);
      
      // Se for PIX e tiver certificado, fazer upload
      if (isAnyPix && certificadoFile && certificadoSenha && resultado.id) {
        try {
          await uploadCertificadoPix(resultado.id, certificadoFile, certificadoSenha);
          toast.success('Configuração e certificado salvos com sucesso!');
        } catch (certErr: any) {
          console.error('Erro ao enviar certificado:', certErr);
          toast.warning(`Configuração salva, mas erro ao enviar certificado: ${certErr.response?.data?.message || certErr.message}`);
        }
      } else {
        toast.success('Configuração criada com sucesso!');
      }
      
 router.push('/dashboard/settings/financeiras?tab=2');
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      toast.error(err.response?.data?.message || 'Erro ao criar configuração');
    } finally {
      setLoading(false);
    }
  };

  const handleGatewayChange = (value: string | null) => {
    if (!value) return;
    const gatewayId = parseInt(value);
    const gateway = gateways.find((g) => g.id === gatewayId);
    if (gateway) {
      setGatewaySelected(gateway.sysId);
      setFormData({ ...formData, gatewayPagamentoId: gatewayId });
    }
  };

  const isGetNet = gatewaySelected === 'GATEWAY_PAGAMENTO_GETNET';
  const isRede = gatewaySelected === 'GATEWAY_PAGAMENTO_REDE';
  const isItauPix = gatewaySelected === 'GATEWAY_PAGAMENTO_ITAU_PIX';
  const isSantanderPix = gatewaySelected === 'GATEWAY_PAGAMENTO_SANTANDER_PIX';
  const isGetNetPix = gatewaySelected === 'GATEWAY_PAGAMENTO_GETNET_PIX';
  const isAnyPix = isItauPix || isSantanderPix || isGetNetPix;

  const getGatewayIcon = () => {
    const iconProps = { sx: { fontSize: 20, color: '#ffffff' } } as const;
    if (isAnyPix) return <PixIcon {...iconProps} />;
    if (isGetNet || isRede) return <CreditCardIcon {...iconProps} />;
    return null;
  };

  const getGatewayName = () => {
    const gateway = gateways.find(g => g.id === formData.gatewayPagamentoId);
    return gateway?.descricao || 'Nenhum gateway selecionado';
  };

  if (loadingGateways) {
    return <LoadingData />;
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography level="h2">
            Nova Configuração
          </Typography>
          {formData.gatewayPagamentoId > 0 && (
            <Chip
              variant="solid"
              color="primary"
              startDecorator={getGatewayIcon()}
              sx={chipStyles}
            >
              {getGatewayName()}
            </Chip>
          )}
        </Box>
      </Box>

      {/* Alert informativo */}
      <Alert
        variant="soft"
        startDecorator={<InfoIcon sx={{ color: 'var(--color-primary)' }} />}
        sx={brandAlertStyles}
      >
        Configure um novo gateway de pagamento preenchendo os dados abaixo. Certifique-se de ter as credenciais corretas do provedor.
      </Alert>

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <Card>
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex((newValue as TabKey) ?? 'general')}
            sx={{ '--Tabs-gap': '12px', bgcolor: 'transparent' }}
          >
            <TabList sx={tabListStyles}>
              <Tab value="general" sx={tabItemStyles}>Configurações Gerais</Tab>
              <Tab value="credentials" sx={tabItemStyles} disabled={!formData.gatewayPagamentoId}>
                Credenciais
              </Tab>
              {isAnyPix && (
                <Tab value="certificate" sx={tabItemStyles} disabled={!formData.gatewayPagamentoId}>
                  Certificado Digital
                </Tab>
              )}
              <Tab value="notes" sx={tabItemStyles}>Observações</Tab>
            </TabList>
            
            {/* Tab 1: Configurações Gerais */}
            <TabPanel value="general">
              <Stack spacing={3}>
                <Alert
                  variant="soft"
                  startDecorator={<InfoIcon sx={{ color: 'var(--color-primary)' }} />}
                  sx={brandAlertStyles}
                >
                  <Box>
                  <Typography fontWeight="bold" sx={{ color: 'var(--color-primary)' }}>
                      Passo 1: Informações Básicas
                    </Typography>
                    <Typography level="body-sm">
                      Selecione o tipo de gateway e informe os dados gerais da configuração
                    </Typography>
                  </Box>
                </Alert>

                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <FormControl required>
                      <FormLabel>Nome de Exibição</FormLabel>
                      <Input
                        value={formData.nomeExibicao}
                        onChange={(e) =>
                          setFormData({ ...formData, nomeExibicao: e.target.value })
                        }
                        placeholder="Ex: Itaú PIX Produção"
                      />
                      <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        Nome amigável para identificar esta configuração
                      </Typography>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <FormControl required>
                      <FormLabel>Gateway</FormLabel>
                      {loadingGateways ? (
                        <Alert variant="soft" color="primary" sx={{ mt: 1 }}>
                          Carregando gateways...
                        </Alert>
                      ) : gateways.length === 0 ? (
                        <Alert variant="soft" color="warning" sx={{ mt: 1 }}>
                          Nenhum gateway disponível
                        </Alert>
                      ) : (
                        <Select
                          value={formData.gatewayPagamentoId > 0 ? formData.gatewayPagamentoId : null}
                          onChange={(_, value) => handleGatewayChange(value?.toString() || null)}
                          placeholder="Selecione o tipo de gateway..."
                        >
                          {gateways.map((gateway) => (
                            <Option key={gateway.id} value={gateway.id}>
                              {gateway.descricao}
                            </Option>
                          ))}
                        </Select>
                      )}
                      <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        Tipo de gateway de pagamento (GetNet, e.Rede, PIX)
                      </Typography>
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <FormControl required>
                      <FormLabel>Empresa</FormLabel>
                      <Select
                        value={empresaSelecionada}
                        onChange={(event, newValue) => {
                          const empresaId = newValue as number | null;
                          setEmpresaSelecionada(empresaId);
                          setFormData({ ...formData, identificador: empresaId ? empresaId.toString() : '' });
                        }}
                        placeholder="Selecione a empresa..."
                        sx={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                          color: "text.primary",
                          "&::placeholder": {
                            color: "text.secondary",
                            opacity: 0.6,
                          },
                          "&:hover": {
                            borderColor: "primary.500",
                          },
                          "&.Mui-focused": {
                            borderColor: "primary.500",
                            boxShadow: "0 0 0 2px rgba(44, 162, 204, 0.2)",
                          },
                          "&.Mui-error": {
                            borderColor: "danger.500",
                          },
                        }}
                      >
                        {empresas?.map((empresa) => (
                          <Option value={Number(empresa.id)} key={empresa.id}>
                            {String(empresa.id)} - {empresa.nome}
                          </Option>
                        ))}
                      </Select>
                      <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        Selecione a empresa vinculada
                      </Typography>
                    </FormControl>
                  </Grid>

                  {isAnyPix && (
                    <Grid xs={12} md={6}>
                      <FormControl required>
                        <FormLabel>Conta Financeira</FormLabel>
                        <Select
                          value={formData.contaFinanceiraVariacaoId}
                          onChange={(event, newValue) => {
                             setFormData({ ...formData, contaFinanceiraVariacaoId: newValue as number });
                          }}
                          placeholder="Selecione a conta financeira..."
                          disabled={!empresaSelecionada}
                        >
                          {contasFinanceiras.map((conta) => (
                            <Option value={conta.id} key={conta.id}>
                               Banco: {conta.banco} / Ag: {conta.agenciaNumero} / CC: {conta.contaNumero}
                            </Option>
                          ))}
                        </Select>
                        <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                          Conta para lançamento do crédito PIX
                        </Typography>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid xs={12} md={6}>
                    <FormControl>
                      <FormLabel>Status</FormLabel>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Switch
                          checked={formData.ativo}
                          onChange={(e) =>
                            setFormData({ ...formData, ativo: e.target.checked })
                          }
                          color={formData.ativo ? 'success' : 'danger'}
                        />
                        <Typography level="body-sm">
                          {formData.ativo ? 'Configuração ativa' : 'Configuração inativa'}
                        </Typography>
                      </Box>
                    </FormControl>
                  </Grid>
                </Grid>

                {formData.gatewayPagamentoId > 0 && (
                  <Alert
                    variant="soft"
                  sx={{ ...brandAlertStyles, bgcolor: 'rgba(0, 200, 236, 0.12)' }}
                    startDecorator={<CheckIcon sx={{ color: 'var(--color-primary)' }} />}
                  >
                    Gateway selecionado! Clique na aba <strong>&quot;Credenciais&quot;</strong> para continuar.
                  </Alert>
                )}
              </Stack>
            </TabPanel>

            {/* Tab 2: Credenciais */}
            <TabPanel value="credentials">
              <Stack spacing={3}>
                {!formData.gatewayPagamentoId && (
                  <Alert
                    variant="soft"
                    startDecorator={<WarningIcon sx={{ color: 'var(--color-secondary)' }} />}
                    sx={{
                      bgcolor: 'rgba(245, 150, 0, 0.18)',
                      border: '1px solid rgba(245, 150, 0, 0.32)',
                      color: 'var(--color-secondary)',
                      borderRadius: '12px'
                    }}
                  >
                    Selecione um gateway na aba &quot;Configurações Gerais&quot; primeiro
                  </Alert>
                )}

                {/* GetNet */}
                {isGetNet && (
                  <Card variant="outlined" sx={sectionCardStyles}>
                    <CardContent>
                      <Typography
                        level="title-md"
                        startDecorator={<CreditCardIcon sx={{ color: 'var(--color-primary)' }} />}
                        sx={{ color: 'var(--color-primary)', fontWeight: 600 }}
                        mb={2}
                      >
                        Credenciais GetNet
                      </Typography>

                      <Stack spacing={2}>
                        <FormControl required>
                          <FormLabel>Client ID</FormLabel>
                          <Input
                            type={showClientId ? "text" : "password"}
                            value={formData.clientId}
                            onChange={(e) =>
                              setFormData({ ...formData, clientId: e.target.value })
                            }
                            placeholder="Client ID fornecido pela GetNet"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowClientId(!showClientId)}
                              >
                                {showClientId ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>

                        <FormControl required>
                          <FormLabel>Client Secret</FormLabel>
                          <Input
                            type={showClientSecret ? "text" : "password"}
                            value={formData.clientSecret}
                            onChange={(e) =>
                              setFormData({ ...formData, clientSecret: e.target.value })
                            }
                            placeholder="Client Secret fornecido pela GetNet"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowClientSecret(!showClientSecret)}
                              >
                                {showClientSecret ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>

                        <FormControl required>
                          <FormLabel>Seller ID</FormLabel>
                          <Input
                            type={showSellerId ? "text" : "password"}
                            value={formData.sellerId}
                            onChange={(e) =>
                              setFormData({ ...formData, sellerId: e.target.value })
                            }
                            placeholder="Seller ID fornecido pela GetNet"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowSellerId(!showSellerId)}
                              >
                                {showSellerId ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* eRede */}
                {isRede && (
                  <Card variant="outlined" sx={sectionCardStyles}>
                    <CardContent>
                      <Typography
                        level="title-md"
                        startDecorator={<CreditCardIcon sx={{ color: 'var(--color-primary)' }} />}
                        sx={{ color: 'var(--color-primary)', fontWeight: 600 }}
                        mb={2}
                      >
                        Credenciais e.Rede
                      </Typography>

                      <Stack spacing={2}>
                        <FormControl required>
                          <FormLabel>PV (Ponto de Venda)</FormLabel>
                          <Input
                            type={showPV ? "text" : "password"}
                            value={formData.pv}
                            onChange={(e) => setFormData({ ...formData, pv: e.target.value })}
                            placeholder="Número do PV fornecido pela e.Rede"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowPV(!showPV)}
                              >
                                {showPV ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>

                        <FormControl required>
                          <FormLabel>Token</FormLabel>
                          <Input
                            type={showToken ? "text" : "password"}
                            value={formData.token}
                            onChange={(e) =>
                              setFormData({ ...formData, token: e.target.value })
                            }
                            placeholder="Token fornecido pela e.Rede"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowToken(!showToken)}
                              >
                                {showToken ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* Itaú PIX */}
                {isItauPix && (
                  <Card variant="outlined" sx={sectionCardStyles}>
                    <CardContent>
                      <Typography
                        level="title-md"
                        startDecorator={<PixIcon sx={{ color: 'var(--color-primary)' }} />}
                        sx={{ color: 'var(--color-primary)', fontWeight: 600 }}
                        mb={2}
                      >
                        Credenciais Itaú PIX
                      </Typography>

                      <Stack spacing={2}>
                        <FormControl required>
                          <FormLabel>Chave PIX</FormLabel>
                          <Input
                            value={formData.chavePix}
                            onChange={(e) =>
                              setFormData({ ...formData, chavePix: e.target.value })
                            }
                            placeholder="CNPJ, e-mail, telefone ou chave aleatória"
                          />
                          <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                            Chave PIX da conta recebedora cadastrada no Itaú
                          </Typography>
                        </FormControl>

                        <Divider sx={{ my: 2 }} />

                        <FormControl required>
                          <FormLabel>OAuth Client ID</FormLabel>
                          <Input
                            type={showItauClientId ? "text" : "password"}
                            value={formData.itauClientId}
                            onChange={(e) =>
                              setFormData({ ...formData, itauClientId: e.target.value })
                            }
                            placeholder="Client ID fornecido pelo Itaú"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowItauClientId(!showItauClientId)}
                              >
                                {showItauClientId ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>

                        <FormControl required>
                          <FormLabel>OAuth Client Secret</FormLabel>
                          <Input
                            type={showItauClientSecret ? "text" : "password"}
                            value={formData.itauClientSecret}
                            onChange={(e) =>
                              setFormData({ ...formData, itauClientSecret: e.target.value })
                            }
                            placeholder="Client Secret fornecido pelo Itaú"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowItauClientSecret(!showItauClientSecret)}
                              >
                                {showItauClientSecret ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* Santander PIX */}
                {isSantanderPix && (
                  <Card variant="outlined" sx={sectionCardStyles}>
                    <CardContent>
                      <Typography
                        level="title-md"
                        startDecorator={<PixIcon sx={{ color: 'var(--color-primary)' }} />}
                        sx={{ color: 'var(--color-primary)', fontWeight: 600 }}
                        mb={2}
                      >
                        Credenciais Santander PIX
                      </Typography>

                      <Stack spacing={2}>
                        <FormControl required>
                          <FormLabel>Chave PIX</FormLabel>
                          <Input
                            value={formData.chavePix}
                            onChange={(e) =>
                              setFormData({ ...formData, chavePix: e.target.value })
                            }
                            placeholder="CNPJ, e-mail, telefone ou chave aleatória"
                          />
                          <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                            Chave PIX da conta recebedora cadastrada no Santander
                          </Typography>
                        </FormControl>

                        <Divider sx={{ my: 2 }} />

                        <FormControl required>
                          <FormLabel>OAuth Client ID</FormLabel>
                          <Input
                            type={showSantanderClientId ? "text" : "password"}
                            value={formData.santanderClientId}
                            onChange={(e) =>
                              setFormData({ ...formData, santanderClientId: e.target.value })
                            }
                            placeholder="Client ID fornecido pelo Santander"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowSantanderClientId(!showSantanderClientId)}
                              >
                                {showSantanderClientId ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>

                        <FormControl required>
                          <FormLabel>OAuth Client Secret</FormLabel>
                          <Input
                            type={showSantanderClientSecret ? "text" : "password"}
                            value={formData.santanderClientSecret}
                            onChange={(e) =>
                              setFormData({ ...formData, santanderClientSecret: e.target.value })
                            }
                            placeholder="Client Secret fornecido pelo Santander"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowSantanderClientSecret(!showSantanderClientSecret)}
                              >
                                {showSantanderClientSecret ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* GetNet PIX */}
                {isGetNetPix && (
                  <Card variant="outlined" sx={sectionCardStyles}>
                    <CardContent>
                      <Typography
                        level="title-md"
                        startDecorator={<PixIcon sx={{ color: 'var(--color-primary)' }} />}
                        sx={{ color: 'var(--color-primary)', fontWeight: 600 }}
                        mb={2}
                      >
                        Credenciais GetNet PIX
                      </Typography>

                      <Stack spacing={2}>
                        <FormControl required>
                          <FormLabel>Chave PIX</FormLabel>
                          <Input
                            value={formData.chavePix}
                            onChange={(e) =>
                              setFormData({ ...formData, chavePix: e.target.value })
                            }
                            placeholder="CNPJ, e-mail, telefone ou chave aleatória"
                          />
                          <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                            Chave PIX da conta recebedora cadastrada no GetNet
                          </Typography>
                        </FormControl>

                        <Divider sx={{ my: 2 }} />

                        <FormControl required>
                          <FormLabel>OAuth Client ID</FormLabel>
                          <Input
                            type={showGetNetPixClientId ? "text" : "password"}
                            value={formData.getNetPixClientId}
                            onChange={(e) =>
                              setFormData({ ...formData, getNetPixClientId: e.target.value })
                            }
                            placeholder="Client ID fornecido pelo GetNet"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowGetNetPixClientId(!showGetNetPixClientId)}
                              >
                                {showGetNetPixClientId ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>

                        <FormControl required>
                          <FormLabel>OAuth Client Secret</FormLabel>
                          <Input
                            type={showGetNetPixClientSecret ? "text" : "password"}
                            value={formData.getNetPixClientSecret}
                            onChange={(e) =>
                              setFormData({ ...formData, getNetPixClientSecret: e.target.value })
                            }
                            placeholder="Client Secret fornecido pelo GetNet"
                            endDecorator={
                              <IconButton
                                size="sm"
                                variant="plain"
                                onClick={() => setShowGetNetPixClientSecret(!showGetNetPixClientSecret)}
                              >
                                {showGetNetPixClientSecret ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            }
                          />
                        </FormControl>

                        <FormControl required>
                          <FormLabel>Seller ID</FormLabel>
                          <Input
                            value={formData.getNetPixSellerId}
                            onChange={(e) =>
                              setFormData({ ...formData, getNetPixSellerId: e.target.value })
                            }
                            placeholder="Seller ID fornecido pelo GetNet"
                          />
                        </FormControl>
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </TabPanel>

            {/* Tab 3: Certificado Digital (só PIX) */}
            {isAnyPix && (
              <TabPanel value="certificate">
                <Stack spacing={3}>
                  <Alert
                    variant="soft"
                    startDecorator={<WarningIcon sx={{ color: 'var(--color-secondary)' }} />}
                    sx={{
                      bgcolor: 'rgba(245, 150, 0, 0.18)',
                      border: '1px solid rgba(245, 150, 0, 0.32)',
                      color: 'var(--color-secondary)',
                      borderRadius: '12px'
                    }}
                  >
                    <Box>
                      <Typography fontWeight="bold">
                        {isGetNetPix ? 'Certificado Digital Opcional' : 'Certificado Digital Obrigatório'}
                      </Typography>
                      <Typography level="body-sm">
                        {isGetNetPix 
                          ? 'GetNet PIX não requer certificado digital. Você pode enviar um certificado opcionalmente se desejar.'
                          : `Para realizar transações PIX com o ${isItauPix ? 'Itaú' : isSantanderPix ? 'Santander' : 'banco selecionado'}, é necessário enviar um certificado digital (.pfx ou .p12) fornecido pelo banco.`}
                      </Typography>
                    </Box>
                  </Alert>

                  <Card variant="outlined" sx={sectionCardStyles}>
                    <CardContent>
                      <Typography
                        level="title-md"
                        startDecorator={<UploadIcon sx={{ color: 'var(--color-primary)' }} />}
                        sx={{ color: 'var(--color-primary)', fontWeight: 600 }}
                        mb={2}
                      >
                        Enviar Certificado Digital
                      </Typography>
                      
                      <Stack spacing={2}>
                        <FormControl required={!isGetNetPix}>
                          <FormLabel>
                            Arquivo do Certificado (.pfx ou .p12)
                          </FormLabel>
                          <Box sx={fileInputStyles}>
                            <input
                              type="file"
                              accept=".pfx,.p12"
                              aria-label="Selecionar certificado digital"
                              title="Selecionar certificado digital (.pfx ou .p12)"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setCertificadoFile(file);
                                }
                              }}
                            />
                            <Box className="file-input-button">
                              <UploadIcon />
                              <Typography>
                                {certificadoFile ? 'Alterar Certificado' : 'Selecionar Certificado Digital'}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography level="body-xs" sx={{ color: 'text.secondary', mt: 1 }}>
                            O certificado será armazenado de forma segura no banco de dados
                          </Typography>
                        </FormControl>

                        {certificadoFile && (
                          <>
                            <Alert
                              variant="soft"
                              sx={brandAlertStyles}
                              startDecorator={<UploadIcon sx={{ color: 'var(--color-primary)' }} />}
                            >
                              Arquivo selecionado: <strong>{certificadoFile.name}</strong> ({(certificadoFile.size / 1024).toFixed(2)} KB)
                            </Alert>

                            <FormControl required>
                              <FormLabel>Senha do Certificado</FormLabel>
                              <Input
                                type="password"
                                placeholder="Digite a senha do arquivo .pfx"
                                value={certificadoSenha}
                                onChange={(e) => setCertificadoSenha(e.target.value)}
                              />
                              <Typography level="body-xs" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                A senha será usada para validar e descriptografar o certificado
                              </Typography>
                            </FormControl>
                          </>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
            )}

            {/* Tab 4: Observações */}
            <TabPanel value="notes">
              <FormControl>
                <FormLabel>Observações (Opcional)</FormLabel>
                <Textarea
                  minRows={4}
                  value={formData.observacao}
                  onChange={(e) =>
                    setFormData({ ...formData, observacao: e.target.value })
                  }
                  placeholder="Adicione anotações internas sobre esta configuração (opcional)..."
                />
                <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                  Estas observações são apenas para uso interno e não afetam o funcionamento
                </Typography>
              </FormControl>
            </TabPanel>
          </Tabs>

          <Divider sx={{ mt: 3, borderColor: 'rgba(1, 90, 103, 0.18)' }} />

          {/* Botões de Ação */}
          <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
            <JoyButton
              variant="outlined"
              color="neutral"
              startDecorator={<CancelIcon />}
 onClick={() => router.push('/dashboard/settings/financeiras?tab=2')}
              disabled={loading}
              size="lg"
            >
              Cancelar
            </JoyButton>
            <JoyButton
              type="submit"
              startDecorator={<SaveIcon />}
              loading={loading}
              size="lg"
            >
              Salvar
            </JoyButton>
          </Box>
        </Card>
      </form>
    </Stack>
  );
}
