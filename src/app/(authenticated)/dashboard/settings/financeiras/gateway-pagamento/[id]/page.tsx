'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Chip,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Grid,
} from '@mui/joy';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon, 
  Visibility, 
  VisibilityOff,
  Settings as SettingsIcon,
  CreditCard as CreditCardIcon,
  Pix as PixIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  buscarPorId,
  atualizar,
  listarGateways,
  uploadCertificadoPix,
  GatewayPagamentoDto,
  GatewayPagamentoConfiguracaoDto,
} from '@/services/api/gatewayPagamentoService';
import { toast } from 'react-toastify';
import LoadingData from '@/components/LoadingData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { getEmpresasVinculadas } from '@/services/querys/framework';

export default function EditarConfiguracaoPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [gateways, setGateways] = useState<GatewayPagamentoDto[]>([]);
  type TabKey = 'general' | 'credentials' | 'certificate' | 'notes';
  const [tabIndex, setTabIndex] = useState<TabKey>('general');

  // Carregar empresas vinculadas
  const { data: empresas } = useQuery({
    queryKey: ["GetEmpresasVinculadas"],
    queryFn: () => getEmpresasVinculadas(),
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
    chavePix: '',
    itauClientId: '',
    itauClientSecret: '',
    santanderClientId: '',
    santanderClientSecret: '',
    certificadoPixConfigurado: false,
    certificadoPixSenha: '',
    idContaMovimentacaoBancariaTse: undefined,
    observacao: '',
    certificadoPixValidade: undefined,
  });

  const [gatewaySelected, setGatewaySelected] = useState<string>('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(null);
  const empresaSincronizadaRef = useRef(false);
  const [showPV, setShowPV] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showClientId, setShowClientId] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showSellerId, setShowSellerId] = useState(false);
  const [showItauClientId, setShowItauClientId] = useState(false);
  const [showItauClientSecret, setShowItauClientSecret] = useState(false);
  const [showSantanderClientId, setShowSantanderClientId] = useState(false);
  const [showSantanderClientSecret, setShowSantanderClientSecret] = useState(false);
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
    '&:hover': {
      bgcolor: 'rgba(0, 200, 236, 0.15)'
    },
    '&.Mui-disabled': {
      color: 'rgba(1, 90, 103, 0.45)'
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
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Sincronizar empresa selecionada quando dados e empresas estiverem disponíveis
  // Isso permite que o usuário altere a empresa manualmente sem interferência após a sincronização inicial
  useEffect(() => {
    // Se já sincronizamos e o usuário mudou manualmente, não interferir
    if (empresaSincronizadaRef.current) {
      return;
    }

    // Verificar se temos empresas carregadas
    if (!empresas || empresas.length === 0) {
      return; // Aguardar empresas serem carregadas
    }

    // Verificar se temos o identificador nos dados do formulário
    const identificador = formData.identificador;
    if (!identificador || identificador === '' || identificador === '0') {
      setEmpresaSelecionada(null);
      empresaSincronizadaRef.current = true;
      return;
    }

    const empresaId = Number(identificador);
    if (!isNaN(empresaId) && empresaId > 0) {
    const empresaEncontrada = empresas.find(emp => Number(emp.id) === empresaId);
      if (empresaEncontrada) {
      setEmpresaSelecionada(Number(empresaEncontrada.id));
        empresaSincronizadaRef.current = true;
        return;
      }
      setEmpresaSelecionada(empresaId);
      empresaSincronizadaRef.current = true;
      return;
    }

    const norm = (s: any) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    const identNorm = norm(identificador);
    const empresaPorNome = empresas.find(emp => {
      const nomeNorm = norm(emp.nome);
      return nomeNorm === identNorm || identNorm.includes(nomeNorm) || nomeNorm.includes(identNorm);
    });
    if (empresaPorNome) {
      setEmpresaSelecionada(empresaPorNome.id);
      empresaSincronizadaRef.current = true;
      return;
    }

    const digits = String(identificador).match(/\d+/)?.[0];
    const altId = digits ? Number(digits) : NaN;
    if (!isNaN(altId) && altId > 0) {
      const empresaAlt = empresas.find(emp => Number(emp.id) === altId);
      if (empresaAlt) {
        setEmpresaSelecionada(empresaAlt.id);
        empresaSincronizadaRef.current = true;
        return;
      }
    }

    setEmpresaSelecionada(null);
    empresaSincronizadaRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresas, formData.identificador]);

  useEffect(() => {
    // Se não for PIX, não mostrar aba de certificado
    const isPixGateway =
      gatewaySelected === 'GATEWAY_PAGAMENTO_ITAU_PIX' ||
      gatewaySelected === 'GATEWAY_PAGAMENTO_SANTANDER_PIX';

    if (!isPixGateway && tabIndex === 'certificate') {
      setTabIndex('credentials');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewaySelected]);

  const carregarDados = async () => {
    try {
      setLoadingData(true);
      const [configData, gatewaysData] = await Promise.all([
        buscarPorId(id),
        listarGateways(),
      ]);
      
      setFormData(configData);
      setGateways(gatewaysData);
      setGatewaySelected(configData.gatewaySysId || '');
      
      // Resetar a flag de sincronização quando novos dados são carregados
      // Isso permite que o useEffect sincronize a empresa quando empresas estiverem disponíveis
      empresaSincronizadaRef.current = false;
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      toast.error('Erro ao carregar dados da configuração');
 router.push('/dashboard/settings/financeiras?tab=2');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gatewayPagamentoId) {
      toast.error('Selecione um gateway');
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
          toast.error('Preencha Client ID e Client Secret do Pix Itaú');
          setTabIndex('credentials');
          return;
        }
      }

      if (isSantanderPix) {
        if (!formData.santanderClientId || !formData.santanderClientSecret) {
          toast.error('Preencha Client ID e Client Secret do Pix Santander');
          setTabIndex('credentials');
          return;
        }
      }

      if (!formData.certificadoPixConfigurado && !certificadoFile) {
        toast.error('É necessário enviar um certificado digital');
        setTabIndex('certificate');
        return;
      }

      if (certificadoFile && !certificadoSenha) {
        toast.error('Informe a senha do certificado digital');
        setTabIndex('certificate');
        return;
      }
    }

    try {
      setLoading(true);
      
      const gateway = gateways.find(g => g.id === formData.gatewayPagamentoId);
      const dadosCompletos = {
        ...formData,
        gatewaySysId: gateway?.sysId || formData.gatewaySysId,
        gatewayDescricao: gateway?.descricao || formData.gatewayDescricao,
      };
      
      await atualizar(id, dadosCompletos);
      
      // Se for PIX e tiver novo certificado, fazer upload
      if (isAnyPix && certificadoFile && certificadoSenha) {
        try {
          await uploadCertificadoPix(id, certificadoFile, certificadoSenha);
          toast.success('Configuração e certificado atualizados com sucesso!');
        } catch (certErr: any) {
          console.error('Erro ao enviar certificado:', certErr);
          toast.warning(`Configuração atualizada, mas erro ao enviar certificado: ${certErr.response?.data?.message || certErr.message}`);
        }
      } else {
        toast.success('Configuração atualizada com sucesso!');
      }
      
 router.push('/dashboard/settings/financeiras?tab=2');
    } catch (err: any) {
      console.error('Erro ao atualizar:', err);
      toast.error(err.response?.data?.message || 'Erro ao atualizar configuração');
    } finally {
      setLoading(false);
    }
  };

  const handleGatewayChange = (value: string | null) => {
    const gatewayId = parseInt(value || '0');
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
  const isAnyPix = isItauPix || isSantanderPix;
  const certificadoValidadeFormatada = useMemo(() => {
    if (!formData.certificadoPixValidade) return null;
    try {
      return format(new Date(formData.certificadoPixValidade), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return formData.certificadoPixValidade;
    }
  }, [formData.certificadoPixValidade]);

  const certificadoExpirado = useMemo(() => {
    if (!formData.certificadoPixValidade) return false;
    return new Date(formData.certificadoPixValidade) < new Date();
  }, [formData.certificadoPixValidade]);

  const certificadoProximoVencer = useMemo(() => {
    if (!formData.certificadoPixValidade) return false;
    const validade = new Date(formData.certificadoPixValidade);
    const agora = new Date();
    const diffMs = validade.getTime() - agora.getTime();
    const dias = diffMs / (1000 * 60 * 60 * 24);
    return !certificadoExpirado && dias <= 30;
  }, [formData.certificadoPixValidade, certificadoExpirado]);

  const getGatewayIcon = () => {
    const iconProps = { sx: { fontSize: 20, color: '#ffffff' } } as const;
    if (isAnyPix) return <PixIcon {...iconProps} />;
    if (isGetNet || isRede) return <CreditCardIcon {...iconProps} />;
    return <SettingsIcon {...iconProps} />;
  };

  if (loadingData) {
    return <LoadingData />;
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={2}>
          <Typography level="h2">
            {formData.nomeExibicao}
          </Typography>
          <Chip
            variant="solid"
            color="primary"
            startDecorator={getGatewayIcon()}
            sx={chipStyles}
          >
            {formData.gatewayDescricao}
          </Chip>
        </Box>
      </Box>

      {/* Alert quando inativo */}
      {!formData.ativo && (
        <Alert
          variant="soft"
          startDecorator={<InfoIcon sx={{ color: 'var(--color-secondary)' }} />}
          sx={{
            bgcolor: 'rgba(245, 150, 0, 0.18)',
            border: '1px solid rgba(245, 150, 0, 0.32)',
            color: 'var(--color-secondary)',
            borderRadius: '12px'
          }}
        >
          Esta configuração está <strong>inativa</strong>. Pagamentos não poderão ser processados.
        </Alert>
      )}

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
              <Tab value="credentials" sx={tabItemStyles}>Credenciais</Tab>
              <Tab value="certificate" sx={tabItemStyles}>Certificado Digital</Tab>
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
                      Ajustes Gerais
                    </Typography>
                    <Typography level="body-sm">
                      Revise os dados principais desta configuração antes de atualizar as credenciais.
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
                      <Select
                        value={formData.gatewayPagamentoId.toString()}
                        onChange={(_, value) => handleGatewayChange(value)}
                        disabled={!isNaN(id) && id > 0}
                      >
                        {gateways
                          .filter((gateway) => gateway.ativo)
                          .map((gateway) => (
                            <Option key={gateway.id} value={gateway.id.toString()}>
                              {gateway.descricao}
                            </Option>
                          ))}
                      </Select>
                      <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        {!isNaN(id) && id > 0 
                          ? 'O tipo de gateway não pode ser alterado após criação' 
                          : 'Selecione o tipo de gateway de pagamento'}
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
                          // Atualizar o estado local
                          setEmpresaSelecionada(empresaId);
                          // Atualizar o formData
                          setFormData({ ...formData, identificador: empresaId ? empresaId.toString() : '' });
                          // Marcar como sincronizado para evitar interferência do useEffect
                          empresaSincronizadaRef.current = true;
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

                {/* Informações de Auditoria */}
                {formData.dataCriacao && (
                  <Card variant="outlined" sx={{ ...sectionCardStyles, background: 'rgba(0, 200, 236, 0.08)' }}>
                    <CardContent>
                      <Typography level="body-sm" fontWeight="bold" mb={1}>
                        Informações de Auditoria
                      </Typography>
                      <Stack spacing={0.5}>
                        <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                          Criado em: <strong>{new Date(formData.dataCriacao).toLocaleString('pt-BR')}</strong>
                        </Typography>
                        {formData.dataAlteracao && (
                          <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                            Última alteração: <strong>{new Date(formData.dataAlteracao).toLocaleString('pt-BR')}</strong>
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </TabPanel>

            {/* Tab 2: Credenciais */}
            <TabPanel value="credentials">
              <Stack spacing={3}>
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
                            placeholder="••••••••"
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
                            placeholder="••••••••"
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

                        <Divider sx={{ my: 2, borderColor: 'rgba(1, 90, 103, 0.18)' }} />

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

                        <Divider sx={{ my: 2, borderColor: 'rgba(1, 90, 103, 0.18)' }} />

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
              </Stack>
            </TabPanel>

            {/* Tab 3: Certificado Digital */}
            <TabPanel value="certificate">
              {!isAnyPix ? (
                <Alert
                  variant="soft"
                  startDecorator={<InfoIcon sx={{ color: 'var(--color-secondary)' }} />}
                  sx={{
                    bgcolor: 'rgba(245, 150, 0, 0.18)',
                    border: '1px solid rgba(245, 150, 0, 0.32)',
                    color: 'var(--color-secondary)',
                    borderRadius: '12px'
                  }}
                >
                  <Typography>
                    Certificado digital é necessário apenas para gateways PIX (Itaú PIX, Santander PIX).
                  </Typography>
                </Alert>
              ) : (
                <Stack spacing={3}>
                  {formData.certificadoPixConfigurado && (
                    <Alert
                      variant="soft"
                      startDecorator={<CheckIcon sx={{ color: 'var(--color-primary)' }} />}
                      sx={brandAlertStyles}
                    >
                      <Stack spacing={0.5}>
                        <Typography fontWeight="bold">
                          Certificado Digital Configurado
                        </Typography>
                        <Typography level="body-sm">
                          Certificado .pfx armazenado com segurança no banco de dados
                        </Typography>
                        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                          <Typography level="body-sm">
                            Validade:&nbsp;
                            <strong>
                              {certificadoValidadeFormatada ?? 'Não disponível'}
                            </strong>
                          </Typography>
                          {certificadoExpirado && (
                            <Chip color="danger" variant="solid" size="sm">
                              Certificado expirado
                            </Chip>
                          )}
                          {!certificadoExpirado && certificadoProximoVencer && (
                            <Chip color="warning" variant="solid" size="sm">
                              Expira em breve
                            </Chip>
                          )}
                        </Stack>
                      </Stack>
                    </Alert>
                  )}

                  <Card variant="outlined" sx={sectionCardStyles}>
                    <CardContent>
                      <Typography
                        level="title-md"
                        startDecorator={<UploadIcon sx={{ color: 'var(--color-primary)' }} />}
                        sx={{ color: 'var(--color-primary)', fontWeight: 600 }}
                        mb={2}
                      >
                        {formData.certificadoPixConfigurado
                          ? 'Atualizar Certificado Digital'
                          : 'Enviar Certificado Digital'}
                      </Typography>
                      
                      <Stack spacing={2}>
                        <FormControl required={!formData.certificadoPixConfigurado}>
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
                                {certificadoFile 
                                  ? 'Alterar Certificado' 
                                  : formData.certificadoPixConfigurado 
                                    ? 'Atualizar Certificado Digital' 
                                    : 'Selecionar Certificado Digital'}
                              </Typography>
                            </Box>
                          </Box>
                          {formData.certificadoPixConfigurado ? (
                            <Typography level="body-xs" sx={{ color: 'text.secondary', mt: 1 }}>
                              Envie um novo certificado apenas se necessário (ex: certificado expirado)
                            </Typography>
                          ) : (
                            <Typography level="body-xs" sx={{ color: 'var(--color-secondary)', mt: 1 }}>
                              ⚠️ Certificado obrigatório para transações PIX com {isItauPix ? 'Itaú' : isSantanderPix ? 'Santander' : 'o banco selecionado'}
                            </Typography>
                          )}
                        </FormControl>

                        {certificadoFile && (
                          <>
                            <Alert
                              variant="soft"
                              sx={brandAlertStyles}
                              startDecorator={<UploadIcon sx={{ color: 'var(--color-primary)' }} />}
                            >
                              Arquivo selecionado: <strong>{certificadoFile.name}</strong>
                            </Alert>
                            
                            <FormControl required>
                              <FormLabel>Senha do Certificado</FormLabel>
                              <Input
                                type="password"
                                placeholder="Digite a senha do arquivo .pfx"
                                value={certificadoSenha}
                                onChange={(e) => setCertificadoSenha(e.target.value)}
                              />
                            </FormControl>
                          </>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              )}
            </TabPanel>

            {/* Tab 4: Observações */}
            <TabPanel value="notes">
              <FormControl>
                <FormLabel>Observações</FormLabel>
                <Textarea
                  minRows={4}
                  value={formData.observacao}
                  onChange={(e) =>
                    setFormData({ ...formData, observacao: e.target.value })
                  }
                  placeholder="Anotações internas sobre esta configuração (opcional)..."
                />
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
              Salvar Configuração
            </JoyButton>
          </Box>
        </Card>
      </form>
    </Stack>
  );
}

