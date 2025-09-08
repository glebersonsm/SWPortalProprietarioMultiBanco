import axios from "@/services/AxiosInstance";
import { DocumentTypes, IncomingDocumentTypes } from "@/utils/types/users";

export const getDocumentTypes = async ({
  personType,
}: {
  personType: number;
}): Promise<DocumentTypes[]> => {
  const response = await axios.get("/TipoDocumento/search", {
    params: { tipoPessoa: personType },
  });
  const data = response.data.data;

  const documentsTypes = data.map((item: IncomingDocumentTypes) => {
    return {
      id: item.id,
      name: item.nome,
      requiresIssueDate: !!item.exigeDataEmissao,
      requiresDueDate: !!item.exigeDataValidade,
      requiresIssuingBody: !!item.exigeOrgaoEmissor,
      mask: item.mascara,
      personType: item.tipoPessoa,
    };
  });

  return documentsTypes;
};
