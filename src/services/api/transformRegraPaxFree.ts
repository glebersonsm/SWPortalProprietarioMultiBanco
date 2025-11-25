import { RegraPaxFree, RegraPaxFreeConfiguracao } from "@/utils/types/regraPaxFree";

type IncomingRegraPaxFree = {
  id?: number;
  Id?: number;
  nome?: string;
  Nome?: string;
  dataInicioVigencia?: string;
  DataInicioVigencia?: string;
  dataInicioVigenciaStr?: string;
  DataInicioVigenciaStr?: string;
  dataFimVigencia?: string;
  DataFimVigencia?: string;
  dataFimVigenciaStr?: string;
  DataFimVigenciaStr?: string;
  configuracoes?: IncomingRegraPaxFreeConfiguracao[];
  Configuracoes?: IncomingRegraPaxFreeConfiguracao[];
  [key: string]: any;
};

type IncomingRegraPaxFreeConfiguracao = {
  id?: number;
  Id?: number;
  regraPaxFreeId?: number;
  RegraPaxFreeId?: number;
  quantidadeAdultos?: number;
  QuantidadeAdultos?: number;
  quantidadePessoasFree?: number;
  QuantidadePessoasFree?: number;
  idadeMaximaAnos?: number;
  IdadeMaximaAnos?: number;
  tipoOperadorIdade?: string;
  TipoOperadorIdade?: string;
  tipoDataReferencia?: string;
  TipoDataReferencia?: string;
  [key: string]: any;
};

export function transformRegraPaxFree(
  regras: IncomingRegraPaxFree[]
): RegraPaxFree[] {
  if (!Array.isArray(regras)) {
    return [];
  }

  return regras.map((regra) => {
    const configuracoes =
      regra.configuracoes || regra.Configuracoes || [];

    const transformedConfiguracoes: RegraPaxFreeConfiguracao[] =
      configuracoes.map((config) => ({
        id: config.id ?? config.Id,
        regraPaxFreeId: config.regraPaxFreeId ?? config.RegraPaxFreeId,
        quantidadeAdultos:
          config.quantidadeAdultos ?? config.QuantidadeAdultos,
        quantidadePessoasFree:
          config.quantidadePessoasFree ?? config.QuantidadePessoasFree,
        idadeMaximaAnos: config.idadeMaximaAnos ?? config.IdadeMaximaAnos,
        tipoOperadorIdade: config.tipoOperadorIdade ?? config.TipoOperadorIdade ?? "<=",
        tipoDataReferencia: config.tipoDataReferencia ?? config.TipoDataReferencia ?? "RESERVA",
      }));

    return {
      id: regra.id ?? regra.Id,
      nome: regra.nome ?? regra.Nome,
      dataInicioVigencia:
        regra.dataInicioVigencia ??
        regra.DataInicioVigencia ??
        regra.dataInicioVigenciaStr ??
        regra.DataInicioVigenciaStr,
      dataFimVigencia:
        regra.dataFimVigencia ??
        regra.DataFimVigencia ??
        regra.dataFimVigenciaStr ??
        regra.DataFimVigenciaStr,
      configuracoes: transformedConfiguracoes,
      usuarioCriacao: regra.usuarioCriacao ?? regra.UsuarioCriacao,
      nomeUsuarioCriacao: regra.nomeUsuarioCriacao ?? regra.NomeUsuarioCriacao,
      dataHoraCriacao: regra.dataHoraCriacao ?? regra.DataHoraCriacao,
      usuarioAlteracao: regra.usuarioAlteracao ?? regra.UsuarioAlteracao,
      nomeUsuarioAlteracao:
        regra.nomeUsuarioAlteracao ?? regra.NomeUsuarioAlteracao,
      dataHoraAlteracao: regra.dataHoraAlteracao ?? regra.DataHoraAlteracao,
    };
  });
}

