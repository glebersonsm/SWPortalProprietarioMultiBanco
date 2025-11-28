import axios from "@/services/AxiosInstance";
import { toast } from "react-toastify";
import getTypeToDownload from "../getTypeDownload";
import {
  DocumentHistory,
  DocumentSent,
  IncomingDocumentHistory,
} from "@/utils/types/documents";
import { format } from "date-fns";

type createDocumentProps = {
  document: {
    id?: number;
    nome: string;
    tagsRequeridas: number[] | null;
    disponivel: number;
    dataInicioVigencia?: string;
    dataFimVigencia?: string;
    arquivo?: File;
  };
  groupDocumentId: number;
};

type editDocumentProps = {
  document: DocumentSent;
};

export const getDocuments = async (documentId: number) => {
  const response = await axios.get("/Documento/search", {
    params: {
      Id: documentId,
      IncluirArquivo: true, // Incluir arquivo para edição
    },
  });
  const data = response.data.data;
  return data;
};

export const createDocument = async ({
  document,
  groupDocumentId,
}: createDocumentProps) => {
  const form = new FormData();

  if (document.id) {
    form.append("id", String(document.id));
  }
  form.append("nome", document.nome);
  form.append("grupoDocumentoId", String(groupDocumentId));
  form.append("disponivel", String(document.disponivel));
  form.append("removerTagsNaoEnviadas", "true");

  if (document.dataInicioVigencia) {
    form.append("dataInicioVigencia", document.dataInicioVigencia);
  }

  if (document.dataFimVigencia) {
    form.append("dataFimVigencia", document.dataFimVigencia);
  }

  if (document.arquivo) {
    form.append("arquivo", document.arquivo);
  }

  if (document.tagsRequeridas && document.tagsRequeridas.length > 0) {
    document.tagsRequeridas.forEach((value) => {
      form.append("tagsRequeridas", String(value));
    });
  }

  const response = await axios.post("/Documento", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 1000000,
  });
  return response.data.data;
};

export const editDocument = async ({ document }: editDocumentProps) => {
  const response = await axios.patch("/Documento", {
    ...document,
  });
  return response.data.data;
};

export const deleteDocument = async (documentId: number) => {
  const response = await axios.post(`/Documento/delete?id=${documentId}`);
  return response.data.data;
};

export const downloadDocument = async (documentId: number, fileName?: string) => {
  try {
    const response = await axios.get(`/Documento/download/${documentId}`, {
      responseType: "arraybuffer",
    });
    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], {
      type: contentType,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const currentDate = format(new Date(), "ddMMyyyy");
    const finalFileName = fileName || `document_${currentDate}${getTypeToDownload(contentType)}`;
    link.href = url;
    link.download = finalFileName;

    document.body.appendChild(link);
    link.click();
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  } catch (error) {
    toast.error("Erro ao baixar arquivo!");
  }
};

export const viewDocument = async (documentId: number) => {
  try {
    const response = await axios.get(`/Documento/download/${documentId}`, {
      responseType: "arraybuffer",
    });
    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], {
      type: contentType,
    });
    const url = URL.createObjectURL(blob);
    
    return {
      url,
      contentType,
      blob,
    };
  } catch (error) {
    toast.error("Erro ao visualizar arquivo!");
    throw error;
  }
};

export const getDocumentHistory = async (
  documentId: number
): Promise<DocumentHistory[]> => {
  const response = await axios.get(`/Documento/history/${documentId}`);
  const data = response.data.data;

  const documentHistory = data.map((item: IncomingDocumentHistory) => {
    return {
      action: item.acaoRealizada,
      date: item.dataOperacao,
      userId: item.usuarioId,
      userName: item.nomeUsuario,
    };
  });

  return documentHistory;
};
