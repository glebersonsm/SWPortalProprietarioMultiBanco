'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Stack, Divider, Button as JoyButton, IconButton as JoyIconButton } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import {
  listarVinculos,
  excluirVinculo,
  GatewayPagamentoVinculoDto,
} from '@/services/api/gatewayVinculoService';
import ReusableDataGrid from '@/components/ReusableDataGrid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { toast } from 'react-toastify';

export default function GatewayVinculoListagemPage() {
  const router = useRouter();

  const { data: vinculos, isLoading, error, refetch } = useQuery({
    queryKey: ['gateway-vinculos'],
    queryFn: listarVinculos,
  });

  const handleExcluir = async (id: number) => {
    if (!confirm('Deseja realmente excluir este vínculo?')) return;

    try {
      await excluirVinculo(id);
      toast.success('Vínculo excluído com sucesso!');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao excluir vínculo');
    }
  };

  const columns: GridColDef[] = [
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
            onClick={() => handleExcluir(params.row.id)}
            title="Excluir"
          >
            <DeleteIcon fontSize="small" />
          </JoyIconButton>
        </Box>
      ),
    },
  ];

  return (
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
        columns={columns}
        loading={isLoading}
      />
    </Stack>
  );
}

