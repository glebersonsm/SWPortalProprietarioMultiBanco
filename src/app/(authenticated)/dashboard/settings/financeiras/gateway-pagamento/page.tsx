'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Stack, Divider, Button as JoyButton, IconButton as JoyIconButton } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import {
  listarConfiguracoes,
  excluir,
  GatewayPagamentoConfiguracaoDto,
} from '@/services/api/gatewayPagamentoService';
import { getEmpresasVinculadas } from '@/services/querys/framework';
import ReusableDataGrid from '@/components/ReusableDataGrid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Chip, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { toast } from 'react-toastify';

export default function GatewayPagamentoListagemPage() {
  const router = useRouter();
  const [filtroGateway, setFiltroGateway] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const { data: configuracoes, isLoading, error, refetch } = useQuery({
    queryKey: ['gateway-pagamento-configs'],
    queryFn: listarConfiguracoes,
  });

  const { data: empresas, isLoading: isLoadingEmpresas } = useQuery({
    queryKey: ['GetEmpresasVinculadas'],
    queryFn: () => getEmpresasVinculadas(),
  });

  const handleExcluir = useCallback(async (id: number) => {
    if (!confirm('Deseja realmente excluir esta configuração?')) return;

    try {
      await excluir(id);
      toast.success('Configuração excluída com sucesso!');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao excluir configuração');
    }
  }, [refetch]);

  const configuracoesFiltradas = (configuracoes || []).filter((config) => {
    const filtroGatewayOk =
      filtroGateway === 'todos' || config.gatewaySysId === filtroGateway;
    const filtroStatusOk =
      filtroStatus === 'todos' ||
      (filtroStatus === 'ativo' && config.ativo) ||
      (filtroStatus === 'inativo' && !config.ativo);
    return filtroGatewayOk && filtroStatusOk;
  });

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      type: 'number',
    },
    {
      field: 'nomeExibicao',
      headerName: 'Nome',
      flex: 1,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams) => 
        params.row.nomeExibicao || params.row.identificador,
    },
    {
      field: 'gatewayDescricao',
      headerName: 'Gateway',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const getColor = () => {
          if (params.row.gatewaySysId === 'GATEWAY_PAGAMENTO_GETNET') return 'primary';
          if (params.row.gatewaySysId === 'GATEWAY_PAGAMENTO_REDE') return 'secondary';
          if (params.row.gatewaySysId === 'GATEWAY_PAGAMENTO_ITAU_PIX') return 'success';
          if (params.row.gatewaySysId === 'GATEWAY_PAGAMENTO_SANTANDER_PIX') return 'error';
          return 'default';
        };
        
        return (
          <Chip
            label={params.value}
            color={getColor()}
            size="small"
          />
        );
      },
    },
    {
      field: 'identificador',
      headerName: 'Empresa',
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-';
        
        if (isLoadingEmpresas) {
          return 'Carregando...';
        }
        
        const empresaId = Number(params.value);
        if (isNaN(empresaId) || empresaId === 0) {
          return params.value || '-';
        }
        
        if (!empresas || empresas.length === 0) {
          return params.value || '-';
        }
        
        const empresa = empresas.find((item) => {
          const itemId = Number(item.id);
          return itemId === empresaId;
        });
        
        if (!empresa || !empresa.nome) {
          return params.value || '-';
        }

        return `${params.value} - ${empresa.nome}`;
      },
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
      width: 110,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" gap={1}>
          <JoyIconButton
            size="sm"
            color="primary"
            onClick={() =>
              router.push(`/dashboard/settings/financeiras/gateway-pagamento/${params.row.id}`)
            }
            title="Editar"
          >
            <EditIcon fontSize="small" />
          </JoyIconButton>
          <JoyIconButton
            size="sm"
            color="danger"
            onClick={() => handleExcluir(params.row.id)}
            title="Excluir"
          >
            <DeleteIcon fontSize="small" />
          </JoyIconButton>
        </Box>
      ),
    },
  ], [empresas, router, handleExcluir, isLoadingEmpresas]);

  return (
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={2}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }} size="small">
            <InputLabel>Gateway</InputLabel>
            <Select
              value={filtroGateway}
              onChange={(e) => setFiltroGateway(e.target.value)}
              label="Gateway"
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="GATEWAY_PAGAMENTO_GETNET">GetNet</MenuItem>
              <MenuItem value="GATEWAY_PAGAMENTO_REDE">e.Rede</MenuItem>
              <MenuItem value="GATEWAY_PAGAMENTO_ITAU_PIX">Itaú PIX</MenuItem>
              <MenuItem value="GATEWAY_PAGAMENTO_SANTANDER_PIX">Santander PIX</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 200 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="ativo">Ativos</MenuItem>
              <MenuItem value="inativo">Inativos</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <JoyButton
          onClick={() => router.push('/dashboard/settings/financeiras/gateway-pagamento/novo')}
        >
          Nova Configuração
        </JoyButton>
      </Box>

      <Divider />

      <ReusableDataGrid
        rows={configuracoesFiltradas}
        columns={columns}
        loading={isLoading}
        height={400}
      />
    </Stack>
  );
}

