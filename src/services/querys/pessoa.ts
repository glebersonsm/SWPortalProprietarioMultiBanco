import axios from "@/services/AxiosInstance";

export type PessoaCompletaModel = {
  id?: number;
  nome?: string;
  documento?: string;
  email?: string;
  dataNascimento?: string;
  sexo?: string;
  telefone?: string;
  ddd?: string;
  ddi?: string;
  estrangeiro?: boolean;
  tipoDocumentoId?: number;
  tipoDocumento?: string;
  enderecos?: Array<{
    id?: number;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    complemento?: string;
    cep?: string;
    cidadeId?: number;
    cidade?: {
      id?: number;
      nome?: string;
      estado?: {
        sigla?: string;
      };
    };
  }>;
};

export type PessoaSearchParams = {
  Documento?: string;
  Tipo?: number; // 0 = CPF, 1 = CNPJ
  Email?: string;
  CarregarCompleto?: boolean;
  Id?: number;
  NumeroDaPagina?: number;
  QuantidadeRegistrosRetornar?: number;
};

export const searchPessoa = async (params: PessoaSearchParams): Promise<PessoaCompletaModel[]> => {
  const response = await axios.get("/Pessoa/search", {
    params: {
      Documento: params.Documento,
      Tipo: params.Tipo,
      Email: params.Email,
      CarregarCompleto: params.CarregarCompleto ?? true,
      Id: params.Id,
      NumeroDaPagina: params.NumeroDaPagina ?? 1,
      QuantidadeRegistrosRetornar: params.QuantidadeRegistrosRetornar ?? 10,
    },
  });

  if (!response.data.success) {
    throw new Error(response.data.errors?.[0] || "Não foi possível buscar a pessoa");
  }

  return response.data.data || [];
};

