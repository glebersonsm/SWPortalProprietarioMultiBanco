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
  Switch,
  Select,
  Option,
} from '@mui/joy';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import {
  criarVinculo,
  buscarEmpresas,
  buscarTorres,
  EmpresaTseDto,
  TorreDto,
  GatewayPagamentoVinculoDto,
} from '@/services/api/gatewayVinculoService';
import { listarConfiguracoes, GatewayPagamentoConfiguracaoDto } from '@/services/api/gatewayPagamentoService';
import { toast } from 'react-toastify';

export default function NovoVinculoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  }, []);

  const carregarDados = async () => {
    try {
      const [empresasData, configsData] = await Promise.all([
        buscarEmpresas(),
        listarConfiguracoes(),
      ]);
      setEmpresas(empresasData);
      setConfiguracoes(configsData);
    } catch (err: any) {
      toast.error('Erro ao carregar dados');
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
      await criarVinculo(formData);
      toast.success('Vínculo criado com sucesso!');
      router.push('/dashboard/settings/financeiras/vinculo');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao criar vínculo');
    } finally {
      setLoading(false);
    }
  };

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
                  placeholder="Selecione a empresa..."
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
                  placeholder={torres.length === 0 ? "Nenhuma torre disponível (insira manualmente o ID)" : "Selecione a torre..."}
                >
                  {torres.map((torre) => (
                    <Option key={torre.idTorre} value={torre.idTorre.toString()}>
                      {torre.nomeTorre}
                    </Option>
                  ))}
                </Select>
                {torres.length === 0 && formData.idEmpresaTse > 0 && (
                  <Box sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                    Nenhuma torre encontrada. Você pode inserir o ID manualmente no campo acima ou criar uma torre primeiro.
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
                  placeholder="Selecione a configuração..."
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

