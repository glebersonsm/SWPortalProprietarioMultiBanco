import { IncomingProperty } from "@/utils/types/multiownership/properties";

export function transformedProperties(properties: IncomingProperty[]) {
  return properties.map((property) => {
    return {
      id: property.id,
      enterpriseId: property.empreendimentoId,
      enterpriseName: property.empreendimentoNome,
      propertyNumber: property.imovelNumero,
      blockCode: property.blocoCodigo,
      blockName: property.blocoNome,
      propertyFloorCode: property.imovelAndarCodigo,
      propertyFloorName: property.imovelAndarNome,
      propertyTypeCode: property.tipoImovelCodigo,
      propertyTypeName: property.tipoImovelNome,
      creationUsername: property.nomeUsuarioCriacao,
      changeUsername: property.nomeUsuarioAlteracao,
      sold: property.qtdeVendida ?? 0,
      available: property.qtdeDisponivel ?? 0,
      blocked: property.qtdeBloqueada ?? 0
    };
  });
}
