import axios from "@/services/AxiosInstance";
import { RegraPaxFree, RegraPaxFreeConfiguracao } from "@/utils/types/regraPaxFree";
import { transformRegraPaxFree } from "../api/transformRegraPaxFree";

type createRegraPaxFreeProps = {
  regra: {
    id?: number;
    nome: string;
    dataInicioVigencia?: string;
    dataFimVigencia?: string;
    configuracoes?: RegraPaxFreeConfiguracao[];
    removerConfiguracoesNaoEnviadas?: boolean;
  };
};

type editRegraPaxFreeProps = {
  regra: {
    id: number;
    nome: string;
    dataInicioVigencia?: string;
    dataFimVigencia?: string;
    configuracoes?: RegraPaxFreeConfiguracao[];
    removerConfiguracoesNaoEnviadas?: boolean;
  };
};

export const searchRegraPaxFree = async (params?: {
  id?: number;
  nome?: string;
  quantidadeRegistrosRetornar?: number;
}): Promise<RegraPaxFree[]> => {
  try {
    const response = await axios.get("/RegraPaxFree/search", {
      params: {
        Id: params?.id,
        Nome: params?.nome,
        QuantidadeRegistrosRetornar: params?.quantidadeRegistrosRetornar || 100,
      },
      timeout: 1000000,
    });
    const data = response.data.data || [];
    // Transformar os dados para o formato correto
    return transformRegraPaxFree(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Erro ao buscar regras pax free:", error);
    return [];
  }
};

export const createRegraPaxFree = async ({
  regra,
}: createRegraPaxFreeProps): Promise<RegraPaxFree> => {
  const response = await axios.post("/RegraPaxFree", {
    id: regra.id,
    nome: regra.nome,
    dataInicioVigencia: regra.dataInicioVigencia,
    dataFimVigencia: regra.dataFimVigencia,
    removerConfiguracoesNaoEnviadas: regra.removerConfiguracoesNaoEnviadas ?? false,
    configuracoes: regra.configuracoes?.map((config) => ({
      id: config.id,
      quantidadeAdultos: config.quantidadeAdultos,
      quantidadePessoasFree: config.quantidadePessoasFree,
      idadeMaximaAnos: config.idadeMaximaAnos,
      tipoOperadorIdade: config.tipoOperadorIdade,
      tipoDataReferencia: config.tipoDataReferencia,
    })),
  });
  return response.data.data;
};

export const editRegraPaxFree = async ({
  regra,
}: editRegraPaxFreeProps): Promise<RegraPaxFree> => {
  const response = await axios.patch("/RegraPaxFree", {
    id: regra.id,
    nome: regra.nome,
    dataInicioVigencia: regra.dataInicioVigencia,
    dataFimVigencia: regra.dataFimVigencia,
    removerConfiguracoesNaoEnviadas: regra.removerConfiguracoesNaoEnviadas ?? false,
    configuracoes: regra.configuracoes?.map((config) => ({
      id: config.id,
      quantidadeAdultos: config.quantidadeAdultos,
      quantidadePessoasFree: config.quantidadePessoasFree,
      idadeMaximaAnos: config.idadeMaximaAnos,
      tipoOperadorIdade: config.tipoOperadorIdade,
      tipoDataReferencia: config.tipoDataReferencia,
    })),
  });
  return response.data.data;
};

export const deleteRegraPaxFree = async (id: number): Promise<void> => {
  await axios.post(`/RegraPaxFree/delete?id=${id}`, null, {
    timeout: 1000000,
  });
};

