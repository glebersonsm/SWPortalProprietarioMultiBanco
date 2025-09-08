import axios from "@/services/AxiosInstance";
import { transformedGroupOfDocs } from "../api/transformGroupOfDocs";
import { FiltersProps, GroupOfDocsSent } from "@/utils/types/documents";

type AddGroupDocData = {
  nome: string;
  tagsRequeridas: number[];
  grupoPublico: number;
  disponivel: number;
};

export const getGroupsDocuments = async (debounceFilters: FiltersProps) => {
  const response = await axios.get("/GrupoDocumento/search", {
    params: {
      RetornarDocumentosDoGrupo: true,
      Id: debounceFilters.id,
      Nome: debounceFilters.name,
      UsuarioCriacao: debounceFilters.creationUser,
    },
    timeout: 1000000,
  });
  const data = response.data.data;
  const groupOfDocs = transformedGroupOfDocs(data);
  return groupOfDocs;
};

export const createGroupDocuments = async (groupDocuments: AddGroupDocData) => {
  const response = await axios.post("/GrupoDocumento", groupDocuments, {
    timeout: 1000000,
  });
  return response.data.data;
};

export const editGroupDocuments = async (groupDocuments: GroupOfDocsSent) => {
  const response = await axios.post("/GrupoDocumento", groupDocuments, {
    timeout: 1000000,
  });
  return response.data.data;
};

export const deleteGroupDocuments = async (groupDocumentsId: number) => {
  const response = await axios.post(`/GrupoDocumento/delete?id=${groupDocumentsId}`, {
    timeout: 1000000,
  });
  return response.data.data;
};
