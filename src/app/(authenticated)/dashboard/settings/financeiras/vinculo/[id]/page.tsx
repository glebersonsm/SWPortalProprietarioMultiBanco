'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Stack,
  Divider,
  Button as JoyButton,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Option,
  Typography,
  Input,
} from '@mui/joy';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import {
  buscarVinculoPorId,
  atualizarVinculo,
  GatewayPagamentoVinculoDto,
} from '@/services/api/gatewayVinculoService';
import { toast } from 'react-toastify';
import LoadingData from '@/components/LoadingData';

// Interface temporária - será substituída quando o service de gatewayPagamento for copiado
interface GatewayPagamentoConfiguracaoDto {
  id?: number;
  nomeExibicao?: string;
  identificador?: string;
  gatewayDescricao?: string;
}

export default function EditarVinculoPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [configuracoes, setConfiguracoes] = useState<GatewayPagamentoConfiguracaoDto[]>([]);
  
  const [formData, setFormData] = useState<GatewayPagamentoVinculoDto>({
    idEmpresaTse: 0,
    idTorre: 0,
    gatewayPagamentoConfiguracaoId: 0,
    ativo: true,
  });

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoadingData(true);
      const vinculoData = await buscarVinculoPorId(id);
      
      setFormData(vinculoData);
      
      // TODO: Carregar configurações quando o service de gatewayPagamento for implementado
      setConfiguracoes([]);
    } catch (err: any) {
      toast.error('Erro ao carregar dados');
      router.push('/dashboard/settings/financeiras');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.idEmpresaTse || formData.idEmpresaTse <= 0) {
      toast.error('Informe o ID da empresa');
      return;
    }
    
    if (!formData.idTorre || formData.idTorre <= 0) {
      toast.error('Informe o ID da torre');
      return;
    }
    
    if (!formData.gatewayPagamentoConfiguracaoId || formData.gatewayPagamentoConfiguracaoId <= 0) {
      toast.error('Selecione uma configuração de gateway');
      return;
    }

    try {
      setLoading(true);
      await atualizarVinculo(id, formData);
      toast.success('Vínculo atualizado com sucesso!');
      router.push('/dashboard/settings/financeiras');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar vínculo');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <LoadingData />;
  }

  return (
    <Stack spacing={3}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <FormLabel>Vínculo Empresa + Torre → Gateway</FormLabel>
            <Divider sx={{ mt: 1, mb: 2 }} />
            
            <Stack spacing={2}>
              <FormControl required>
                <FormLabel>ID Empresa</FormLabel>
                <Input
                  type="number"
                  value={formData.idEmpresaTse || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, idEmpresaTse: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Informe o ID da empresa"
                />
              </FormControl>

              <FormControl required>
                <FormLabel>ID Torre</FormLabel>
                <Input
                  type="number"
                  value={formData.idTorre || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, idTorre: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Informe o ID da torre"
                />
              </FormControl>

              <FormControl required>
                <FormLabel>Configuração de Gateway</FormLabel>
                <Select
                  value={formData.gatewayPagamentoConfiguracaoId.toString()}
                  onChange={(_, value) =>
                    setFormData({
                      ...formData,
                      gatewayPagamentoConfiguracaoId: parseInt(value || '0'),
                    })
                  }
                  placeholder="Selecione a configuração..."
                  disabled={configuracoes.length === 0}
                >
                  {configuracoes.map((config) => (
                    <Option key={config.id} value={config.id!.toString()}>
                      {config.gatewayDescricao} - {config.nomeExibicao || config.identificador}
                    </Option>
                  ))}
                </Select>
                {configuracoes.length === 0 && (
                  <Box sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                    Nenhuma configuração disponível. Configure os gateways primeiro.
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Ativo</FormLabel>
                <Switch
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, ativo: e.target.checked })
                  }
                />
              </FormControl>
            </Stack>
          </Box>

          {/* Informações de Auditoria */}
          {formData.dataCriacao && (
            <Box>
              <Divider sx={{ mb: 2 }} />
              <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                Criado em: {new Date(formData.dataCriacao).toLocaleString('pt-BR')}
              </Typography>
              {formData.dataAlteracao && (
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  Última alteração: {new Date(formData.dataAlteracao).toLocaleString('pt-BR')}
                </Typography>
              )}
            </Box>
          )}

          <Divider />

          <Box display="flex" gap={2} justifyContent="flex-end">
            <JoyButton
              variant="outlined"
              color="neutral"
              startDecorator={<CancelIcon />}
              onClick={() => router.push('/dashboard/settings/financeiras')}
              disabled={loading}
            >
              Cancelar
            </JoyButton>
            <JoyButton
              type="submit"
              startDecorator={<SaveIcon />}
              loading={loading}
            >
              Salvar
            </JoyButton>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
}

