import { formatDate } from "@/utils/dates";
import { IncomingOwner } from "@/utils/types/multiownership/owners";

export function transformedOwners(owners: IncomingOwner[]) {
  return owners.map((owner) => {
    return {
      purchaseDate: formatDate(owner.dataAquisicao),
      enterpriseId: owner.empreendimentoId,
      enterpriseName: owner.empreendimentoNome,
      propertyNumber: owner.imovelNumero,
      blockCode: owner.blocoCodigo,
      blockName: owner.blocoNome,
      propertyFloorCode: owner.imovelAndarCodigo,
      propertyFloorName: owner.imovelAndarNome,
      propertyTypeCode: owner.tipoImovelCodigo,
      propertyTypeName: owner.tipoImovelNome,
      quotaId: owner.cotaId,
      quotaGroupId: owner.grupoCotaCodigo,
      quotaGroupNome: owner.grupoCotaNome,
      fractionCode: owner.codigoFracao,
      fractionName: owner.nomeFracao,
      clientId: owner.clienteId,
      clientCode: owner.clienteCodigo,
      clientName: owner.nomeCliente,
      creationUsername: owner.nomeUsuarioCriacao,
      changeUsername: owner.nomeUsuarioAlteracao,
      contractNumber: owner.numeroContrato,
      clientDocument: owner.cpfCnpjCliente,
      clientEmail: owner.email,
      idIntercambiadora: owner.idIntercambiadora,
      hasSCPContract : owner.possuiContratoSCP,
      tipoPessoa: owner.tipoPessoa
    };
  });
}
