export type IncomingOwner = {
  dataAquisicao: string;
  empreendimentoId: number;
  empreendimentoNome: string;
  imovelNumero: string;
  blocoCodigo: string;
  blocoNome: string;
  imovelAndarCodigo: string;
  imovelAndarNome: string;
  tipoImovelCodigo: string;
  tipoImovelNome: string;
  cotaId: number;
  grupoCotaCodigo: string;
  grupoCotaNome: string;
  codigoFracao: string;
  nomeFracao: string;
  clienteId: number;
  clienteCodigo: string;
  nomeCliente: string;
  nomeUsuarioCriacao: string;
  nomeUsuarioAlteracao: string;
  numeroContrato: string;
  cpfCnpjCliente: string;
  email: string;
  possuiContratoSCP: boolean
  idIntercambiadora:string
  tipoPessoa: string
};

export type Owner = {
  purchaseDate: string;
  enterpriseId: number;
  enterpriseName: string;
  propertyNumber: string;
  blockCode: string;
  blockName: string;
  propertyFloorCode: string;
  propertyFloorName: string;
  propertyTypeCode: string;
  propertyTypeName: string;
  quotaId: number;
  quotaGroupId: string;
  quotaGroupNome: string;
  fractionCode: string;
  fractionName: string;
  clientId: number;
  clientCode: string;
  clientName: string;
  clientDocument: string;
  clientEmail: string;
  creationUsername: string;
  changeUsername: string;
  contractNumber: string;
  hasSCPContract:boolean
  idIntercambiadora:string
  tipoPessoa: string
};

export type FiltersProps = {
  clientName: string;
  unitNumber: string;
  quotaFraction: string;
  contractNumber: string;
  purchaseDateInitial: string;
  purchaseDateFinal: string;
  clientDocument: string;
  companyId: number,
  contractSigned: string;
};

export type Owners = {
  owners: Owner[];
  lastPageNumber: number;
  pageNumber: number;
};

export type GetInfoContractsData = {
  key: string;
  value: string;
}

export type paramsgetInfoContracts = {
  CotaOrContratoId?: number
  UhCondominioId?: number
  PeriodoCotaDisponibilidadeId?: number
  reportType?: number
}


export interface ReservaVoucherDados {
  numeroReserva?: string;
  cliente?: string;
  hospedePrincipal?: string;
  tipoUso?: string;
  contrato?: string;
  nomeHotel?: string;
  observacao?: string;
  tipoCliente?: string;
  dataChegada?: string;
  horaChegada?: string;
  dataPartida?: string;
  horaPartida?: string;
  acomodacao?: string;
  quantidadePax?: string;
}
