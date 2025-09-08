import { Document } from "@/utils/types/documents";
import { untransformedTags } from "./transformTags";

export function untransformedDoc(
  document: Document & { removeUnsetTags: boolean }
) {
  return {
    id: document.id,
    nome: document.name,
    tagsRequeridas: untransformedTags(document.requiredTags),
    path: document.path,
    disponivel: document.available ? 1 : 0,
    grupoDocumentoId: document.groupDocumentId,
    usuarioCriacao: document.creationUser,
    removerTagsNaoEnviadas: true,
  };
}
