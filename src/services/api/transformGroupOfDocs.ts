import { GroupOfDocs, IncomingGroupOfDocs } from "@/utils/types/documents";
import { untransformedTags } from "./transformTags";
import { RequiredTags } from "@/utils/types/tags";

type IncomingDocumentTags = {
  id?: number;
  documentoId?: number;
  tags?: {
    id?: number;
    Id?: number;
    nome?: string;
    Nome?: string;
    [key: string]: any;
  };
  Tags?: {
    id?: number;
    Id?: number;
    nome?: string;
    Nome?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export function transformedGroupOfDocs(groupsOfDocs: IncomingGroupOfDocs[]) {
  return groupsOfDocs.map((groupOfDoc) => {
    const documents = groupOfDoc?.documentos?.map((document) => {
      let requiredTags: RequiredTags[] = [];

      const tagsRequeridas = (document as any).tagsRequeridas as IncomingDocumentTags[] | undefined;

      if (
        tagsRequeridas &&
        Array.isArray(tagsRequeridas) &&
        tagsRequeridas.length > 0
      ) {
        requiredTags = tagsRequeridas
          .map((tagRelation) => {
            const tagEntity = tagRelation.tags || tagRelation.Tags;
            if (!tagEntity) {
              return null;
            }

            const tagId = tagEntity.id ?? tagEntity.Id;
            const tagName = tagEntity.nome ?? tagEntity.Nome;

            if (tagId == null) {
              return null;
            }

            return {
              id: tagId,
              name: tagName || "",
            };
          })
          .filter((tag): tag is RequiredTags => tag != null);
      }

      // Converter datas de vigência
      let dataInicioVigencia: string | undefined;
      let dataFimVigencia: string | undefined;
      
      if ((document as any).dataInicioVigencia) {
        const dataInicio = (document as any).dataInicioVigencia;
        if (typeof dataInicio === 'string') {
          dataInicioVigencia = dataInicio.split('T')[0];
        } else if (dataInicio instanceof Date) {
          dataInicioVigencia = dataInicio.toISOString().split('T')[0];
        } else if ((document as any).dataInicioVigenciaStr) {
          dataInicioVigencia = (document as any).dataInicioVigenciaStr;
        }
      }
      
      if ((document as any).dataFimVigencia) {
        const dataFim = (document as any).dataFimVigencia;
        if (typeof dataFim === 'string') {
          dataFimVigencia = dataFim.split('T')[0];
        } else if (dataFim instanceof Date) {
          dataFimVigencia = dataFim.toISOString().split('T')[0];
        } else if ((document as any).dataFimVigenciaStr) {
          dataFimVigencia = (document as any).dataFimVigenciaStr;
        }
      }

      return {
        id: document.id,
        name: document.nome,
        requiredTags: requiredTags,
        arquivoBase64: (document as any).arquivoBase64 || (document as any).arquivo,
        nomeArquivo: (document as any).nomeArquivo,
        tipoMime: (document as any).tipoMime,
        available: !!document.disponivel,
        dataInicioVigencia: dataInicioVigencia,
        dataFimVigencia: dataFimVigencia,
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
  // Não precisamos transformar os documentos aqui, pois eles são gerenciados individualmente
  // Esta função agora apenas transforma os dados do grupo de documentos

  return {
    id: groupOfDoc.id,
    nome: groupOfDoc.name,
    empresaId: groupOfDoc.companyId,
    disponivel: groupOfDoc.available ? 1 : 0,
    tagsRequeridas: untransformedTags(groupOfDoc.requiredTags),
    removerTagsNaoEnviadas: true,
  };
}
