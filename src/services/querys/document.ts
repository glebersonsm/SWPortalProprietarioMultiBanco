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
    nome: string;
    tagsRequeridas: number[] | null;
    disponivel: number;
    path: FileList;
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

  Object.keys(document).forEach((key) => {
    if (key !== "tagsRequeridas" && key !== "path") {
      const value = document[key as keyof typeof document];
      if (value !== undefined) {
        form.append(key, String(value));
      }
    }
  });
  form.append("files", document.path[0]);
  form.append("grupoDocumentoId", String(groupDocumentId));
  document.tagsRequeridas?.forEach((value) => {
    form.append("tagsRequeridas", String(value));
  });

  const response = await axios.post("/Documento", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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

export const downloadDocument = async (documentId: number) => {
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
    const fileName = `document_${currentDate}${getTypeToDownload(contentType)}`;
    link.href = url;
    link.download = fileName;

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
