export type RegraPaxFreeConfiguracao = {
  id?: number;
  regraPaxFreeId?: number;
  quantidadeAdultos?: number;
  quantidadePessoasFree?: number;
  idadeMaximaAnos?: number;
  tipoOperadorIdade?: string; // ">=" para superior ou igual, "<=" para inferior ou igual
  tipoDataReferencia?: string; // "RESERVA" para data da reserva (hoje), "CHECKIN" para data de check-in
};

export type RegraPaxFree = {
  id?: number;
  nome?: string;
  dataInicioVigencia?: string;
  dataFimVigencia?: string;
  configuracoes?: RegraPaxFreeConfiguracao[];
  usuarioCriacao?: number;
  nomeUsuarioCriacao?: string;
  dataHoraCriacao?: string;
  usuarioAlteracao?: number;
  nomeUsuarioAlteracao?: string;
  dataHoraAlteracao?: string;
};

