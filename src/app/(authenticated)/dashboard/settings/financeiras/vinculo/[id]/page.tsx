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
} from '@mui/joy';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import {
  buscarVinculoPorId,
  atualizarVinculo,
  buscarEmpresas,
  buscarTorres,
  EmpresaTseDto,
  TorreDto,
  GatewayPagamentoVinculoDto,
} from '@/services/api/gatewayVinculoService';
import { listarConfiguracoes, GatewayPagamentoConfiguracaoDto } from '@/services/api/gatewayPagamentoService';
import { toast } from 'react-toastify';
import LoadingData from '@/components/LoadingData';

export default function EditarVinculoPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [empresas, setEmpresas] = useState<EmpresaTseDto[]>([]);
  const [torres, setTorres] = useState<TorreDto[]>([]);
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
      const [vinculoData, empresasData, configsData] = await Promise.all([
        buscarVinculoPorId(id),
        buscarEmpresas(),
        listarConfiguracoes(),
      ]);
      
      setFormData(vinculoData);
      setEmpresas(empresasData);
      setConfiguracoes(configsData);
      
      // Carregar torres da empresa
      if (vinculoData.idEmpresaTse) {
        const torresData = await buscarTorres(vinculoData.idEmpresaTse);
        setTorres(torresData);
      }
    } catch (err: any) {
      toast.error('Erro ao carregar dados');
      router.push('/dashboard/settings/financeiras/vinculo');
    } finally {
      setLoadingData(false);
    }
  };

  const handleEmpresaChange = async (value: string | null) => {
    const empresaId = parseInt(value || '0');
    setFormData({ ...formData, idEmpresaTse: empresaId, idTorre: 0 });
    
    if (empresaId > 0) {
      try {
        const torresData = await buscarTorres(empresaId);
        setTorres(torresData);
      } catch (err: any) {
        toast.error('Erro ao carregar torres');
      }
    } else {
      setTorres([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.idEmpresaTse) {
      toast.error('Selecione uma empresa');
      return;
    }
    
    if (!formData.idTorre) {
      toast.error('Selecione uma torre');
      return;
    }
    
    if (!formData.gatewayPagamentoConfiguracaoId) {
      toast.error('Selecione uma configuração de gateway');
      return;
    }

    try {
      setLoading(true);
      await atualizarVinculo(id, formData);
      toast.success('Vínculo atualizado com sucesso!');
      router.push('/dashboard/settings/financeiras/vinculo');
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
                <FormLabel>Empresa</FormLabel>
                <Select
                  value={formData.idEmpresaTse.toString()}
                  onChange={(_, value) => handleEmpresaChange(value)}
                >
                  {empresas.map((empresa) => (
                    <Option key={empresa.idEmpresa} value={empresa.idEmpresa.toString()}>
                      {empresa.nomeEmpresa}
                    </Option>
                  ))}
                </Select>
              </FormControl>

              <FormControl required disabled={!formData.idEmpresaTse}>
                <FormLabel>Torre</FormLabel>
                <Select
                  value={formData.idTorre.toString()}
                  onChange={(_, value) =>
                    setFormData({ ...formData, idTorre: parseInt(value || '0') })
                  }
                  placeholder={torres.length === 0 ? "Nenhuma torre disponível" : "Selecione a torre..."}
                >
                  {torres.map((torre) => (
                    <Option key={torre.idTorre} value={torre.idTorre.toString()}>
                      {torre.nomeTorre}
                    </Option>
                  ))}
                </Select>
                {torres.length === 0 && formData.idEmpresaTse > 0 && (
                  <Box sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                    Nenhuma torre encontrada para esta empresa.
                  </Box>
                )}
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
                >
                  {configuracoes.map((config) => (
                    <Option key={config.id} value={config.id!.toString()}>
                      {config.gatewayDescricao} - {config.nomeExibicao || config.identificador}
                    </Option>
                  ))}
                </Select>
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
              onClick={() => router.push('/dashboard/settings/financeiras/vinculo')}
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

