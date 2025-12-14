import axios from "@/services/AxiosInstance";

export interface GatewayPagamentoDto {
  id: number;
  sysId: string;
  descricao: string;
  ativo: boolean;
}

export interface GatewayPagamentoConfiguracaoDto {
  id?: number;
  gatewayPagamentoId: number;
  nomeExibicao: string;
  identificador: string;
  ativo: boolean;
  
  // GetNet
  clientId?: string;
  clientSecret?: string;
  sellerId?: string;
  
  // eRede
  pv?: string;
  token?: string;
  
  // PIX (Itaú, Santander, etc)
  chavePix?: string;
  itauClientId?: string;
  itauClientSecret?: string;
  santanderClientId?: string;
  santanderClientSecret?: string;
  certificadoPixConfigurado?: boolean;
  certificadoPixSenha?: string;
  contaFinanceiraVariacaoId?: number;
  certificadoPixValidade?: string;
  
  observacao?: string;
  
  // Read-only
  gatewayDescricao?: string;
  gatewaySysId?: string;
  dataCriacao?: string;
  dataAlteracao?: string;
}

export const listarConfiguracoes = async (): Promise<GatewayPagamentoConfiguracaoDto[]> => {
  const response = await axios.get('/api/configuracoes/gateway-pagamento');
  return response.data;
};

export const listarGateways = async (): Promise<GatewayPagamentoDto[]> => {
  const response = await axios.get('/api/configuracoes/gateway-pagamento/gateways');
  return response.data;
};

export const buscarPorId = async (id: number): Promise<GatewayPagamentoConfiguracaoDto> => {
  const response = await axios.get(`/api/configuracoes/gateway-pagamento/${id}`);
  return response.data;
};

export interface ContaFinanceiraDto {
  id: number;
  banco: string;
  agenciaNumero: string;
  agenciaDigito: string;
  contaNumero: string;
  contaDigito: string;
  cedente: string;
}

export const listarContasFinanceiras = async (empresaId: number): Promise<ContaFinanceiraDto[]> => {
  const response = await axios.get(`/Financeiro/contasfinanceiras/empresa/${empresaId}`);
  return response.data.data;
};

export const criar = async (dto: GatewayPagamentoConfiguracaoDto): Promise<GatewayPagamentoConfiguracaoDto> => {
  // Limpar campos não utilizados antes de enviar
  const payload: any = {
    gatewayPagamentoId: dto.gatewayPagamentoId,
    nomeExibicao: dto.nomeExibicao,
    identificador: dto.identificador,
    ativo: dto.ativo,
    observacao: dto.observacao || null,
  };

  // Adicionar campos específicos do gateway selecionado
  if (dto.gatewaySysId === 'GATEWAY_PAGAMENTO_GETNET' || dto.clientId || dto.clientSecret || dto.sellerId) {
    payload.clientId = dto.clientId || null;
    payload.clientSecret = dto.clientSecret || null;
    payload.sellerId = dto.sellerId || null;
  }

  if (dto.gatewaySysId === 'GATEWAY_PAGAMENTO_REDE' || dto.pv || dto.token) {
    payload.pv = dto.pv || null;
    payload.token = dto.token || null;
  }

  const isPixGateway =
    dto.gatewaySysId === 'GATEWAY_PAGAMENTO_ITAU_PIX' ||
    dto.gatewaySysId === 'GATEWAY_PAGAMENTO_SANTANDER_PIX';

  if (isPixGateway || dto.chavePix || dto.itauClientId || dto.santanderClientId) {
    payload.chavePix = dto.chavePix || null;
    payload.contaFinanceiraVariacaoId = dto.contaFinanceiraVariacaoId || null;

    if (dto.gatewaySysId === 'GATEWAY_PAGAMENTO_ITAU_PIX' || dto.itauClientId || dto.itauClientSecret) {
      payload.itauClientId = dto.itauClientId || null;
      payload.itauClientSecret = dto.itauClientSecret || null;
    }

    if (dto.gatewaySysId === 'GATEWAY_PAGAMENTO_SANTANDER_PIX' || dto.santanderClientId || dto.santanderClientSecret) {
      payload.santanderClientId = dto.santanderClientId || null;
      payload.santanderClientSecret = dto.santanderClientSecret || null;
    }
  }

  const response = await axios.post('/api/configuracoes/gateway-pagamento', payload);
  return response.data;
};

export const atualizar = async (id: number, dto: GatewayPagamentoConfiguracaoDto): Promise<GatewayPagamentoConfiguracaoDto> => {
  // Limpar campos não utilizados antes de enviar
  const payload: any = {
    gatewayPagamentoId: dto.gatewayPagamentoId,
    nomeExibicao: dto.nomeExibicao,
    identificador: dto.identificador,
    ativo: dto.ativo,
    observacao: dto.observacao || null,
  };

  // Adicionar campos específicos do gateway selecionado
  if (dto.gatewaySysId === 'GATEWAY_PAGAMENTO_GETNET' || dto.clientId || dto.clientSecret || dto.sellerId) {
    payload.clientId = dto.clientId || null;
    payload.clientSecret = dto.clientSecret || null;
    payload.sellerId = dto.sellerId || null;
  }

  if (dto.gatewaySysId === 'GATEWAY_PAGAMENTO_REDE' || dto.pv || dto.token) {
    payload.pv = dto.pv || null;
    payload.token = dto.token || null;
  }

  const isPixGateway =
    dto.gatewaySysId === 'GATEWAY_PAGAMENTO_ITAU_PIX' ||
    dto.gatewaySysId === 'GATEWAY_PAGAMENTO_SANTANDER_PIX';

  if (isPixGateway || dto.chavePix || dto.itauClientId || dto.santanderClientId) {
    payload.chavePix = dto.chavePix || null;
    payload.contaFinanceiraVariacaoId = dto.contaFinanceiraVariacaoId || null;

    if (dto.gatewaySysId === 'GATEWAY_PAGAMENTO_ITAU_PIX' || dto.itauClientId || dto.itauClientSecret) {
      payload.itauClientId = dto.itauClientId || null;
      payload.itauClientSecret = dto.itauClientSecret || null;
    }

    if (dto.gatewaySysId === 'GATEWAY_PAGAMENTO_SANTANDER_PIX' || dto.santanderClientId || dto.santanderClientSecret) {
      payload.santanderClientId = dto.santanderClientId || null;
      payload.santanderClientSecret = dto.santanderClientSecret || null;
    }
  }

  const response = await axios.put(`/api/configuracoes/gateway-pagamento/${id}`, payload);
  return response.data;
};

export const excluir = async (id: number): Promise<void> => {
  await axios.delete(`/api/configuracoes/gateway-pagamento/${id}`);
};

export const uploadCertificadoPix = async (id: number, certificado: File, senha: string): Promise<void> => {
  console.log('uploadCertificadoPix - Parâmetros recebidos:', {
    id,
    certificadoNome: certificado?.name,
    certificadoTamanho: certificado?.size,
    senhaLength: senha?.length,
    senhaValor: senha ? '***' : '(vazia)'
  });

  const formData = new FormData();
  formData.append('certificado', certificado);
  formData.append('senha', senha);

  // Log do FormData
  console.log('uploadCertificadoPix - FormData entries:');
  Array.from(formData.entries()).forEach(([key, value]) => {
    console.log(key + ':', value instanceof File ? `File(${value.name})` : value);
  });

  // NÃO definir Content-Type manualmente - o axios adiciona automaticamente com o boundary correto
  await axios.post(`/api/configuracoes/gateway-pagamento/${id}/upload-certificado-pix`, formData);
};

