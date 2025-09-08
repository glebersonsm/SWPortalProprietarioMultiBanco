export type IncomingProperty = {
  id: number;
  empreendimentoId: number;
  empreendimentoNome: string;
  imovelNumero: string;
  blocoCodigo: string;
  blocoNome: string;
  imovelAndarCodigo: string;
  imovelAndarNome: string;
  tipoImovelCodigo: string;
  tipoImovelNome: string;
  nomeUsuarioCriacao: string;
  nomeUsuarioAlteracao: string;
  qtdeVendida?: number | null;
  qtdeDisponivel?: number | null; 
  qtdeBloqueada: number | null;
};

export type Property = {
  id: number;
  enterpriseId: number;
  enterpriseName: string;
  propertyNumber: string;
  blockCode: string;
  blockName: string;
  propertyFloorCode: string;
  propertyFloorName: string;
  propertyTypeCode: string;
  propertyTypeName: string;
  creationUsername: string;
  changeUsername: string;
  sold: number | string | undefined;
  available: number | string | undefined;
  blocked: number | string | undefined;
};

export type Properties = {
  properties: Property[];
  lastPageNumber: number;
  pageNumber: number;
};

export type FiltersProps = {
  propertyNumber: string;
  blockCode: string;
};
