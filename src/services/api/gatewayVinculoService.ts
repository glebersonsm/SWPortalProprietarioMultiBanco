import axios from "@/services/AxiosInstance";

export interface GatewayPagamentoVinculoDto {
  id?: number;
  idEmpresaTse: number;
  idTorre: number;
  gatewayPagamentoConfiguracaoId: number;
  ativo: boolean;
  nomeEmpresa?: string;
  nomeTorre?: string;
  gatewayNome?: string;
  configuracaoNome?: string;
  dataCriacao?: string;
  dataAlteracao?: string;
}

export const listarVinculos = async (): Promise<GatewayPagamentoVinculoDto[]> => {
  const response = await axios.get('/api/configuracoes/gateway-vinculo');
  return response.data;
};

export const buscarVinculoPorId = async (id: number): Promise<GatewayPagamentoVinculoDto> => {
  const response = await axios.get(`/api/configuracoes/gateway-vinculo/${id}`);
  return response.data;
};

export const criarVinculo = async (dto: GatewayPagamentoVinculoDto): Promise<GatewayPagamentoVinculoDto> => {
  const response = await axios.post('/api/configuracoes/gateway-vinculo', dto);
  return response.data;
};

export const atualizarVinculo = async (id: number, dto: GatewayPagamentoVinculoDto): Promise<GatewayPagamentoVinculoDto> => {
  const response = await axios.put(`/api/configuracoes/gateway-vinculo/${id}`, dto);
  return response.data;
};

export const excluirVinculo = async (id: number): Promise<void> => {
  await axios.delete(`/api/configuracoes/gateway-vinculo/${id}`);
};

