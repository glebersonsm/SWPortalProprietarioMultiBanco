import { GroupOfDocs, IncomingGroupOfDocs } from "@/utils/types/documents";
import { untransformedTags } from "./transformTags";

export function transformedGroupOfDocs(groupsOfDocs: IncomingGroupOfDocs[]) {
  return groupsOfDocs.map((groupOfDoc) => {
    const documents = groupOfDoc?.documentos?.map((document) => {
      const requiredTags = document.tagsRequeridas.map((tag) => {
        return {
          id: tag.tags.id,
          name: tag.tags.nome,
        };
      });

      return {
        id: document.id,
        name: document.nome,
        requiredTags: requiredTags,
        path: document.path,
        available: !!document.disponivel,
        groupDocumentId: document.grupoDocumentoId,
        creationUser: document.usuarioCriacao,
      };
    });

    const requiredTags = groupOfDoc.tagsRequeridas?.map((tag) => {
      return {
        id: tag.tags.id,
        name: tag.tags.nome,
      };
    });

    return {
      id: groupOfDoc.id,
      name: groupOfDoc.nome,
      requiredTags: requiredTags,
      companyId: groupOfDoc.empresaId,
      available: !!groupOfDoc.disponivel,
      documents: documents,
    };
  });
}

export function untransformedGroupOfDocs(
  groupOfDoc: GroupOfDocs & { removeUnsetTags: boolean }
) {
  const documents = groupOfDoc?.documents?.map((document) => {
    return {
      id: document.id,
      nome: document.name,
      tagsRequeridas: document.requiredTags,
      path: document.path,
      disponivel: document.available ? 1 : 0,
      grupoDocumentoId: document.groupDocumentId,
      usuarioCriacao: document.creationUser,
    };
  });

  return {
    id: groupOfDoc.id,
    nome: groupOfDoc.name,
    empresaId: groupOfDoc.companyId,
    disponivel: groupOfDoc.available ? 1 : 0,
    tagsRequeridas: untransformedTags(groupOfDoc.requiredTags),
    removerTagsNaoEnviadas: true,
  };
}
