import axios from "@/services/AxiosInstance";
import { FiltersProps, GroupsImages } from "@/utils/types/groupImages";
import { transformedGroupImages } from "../api/transformGroupImages";

export const getGroupsImages = async (
  debounceFilters: FiltersProps,
  page: number
): Promise<GroupsImages> => {
  const response = await axios.get("/GrupoImagem/search", {
    params: {
      RetornarImagens: true,
      Id: debounceFilters.id,
      Nome: debounceFilters.name,
      UsuarioCriacao: debounceFilters.creationUser,
      NumeroDaPagina: page,
      QuantidadeRegistrosRetornar: 10,
    },
    timeout: 1000000,
  });
  const data = response.data.data;

  const groupsImages = transformedGroupImages(data);

  return {
    groupsImages: groupsImages,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};

export const createGroupImages = async (data: {
  name: string;
  tagsRequeridas: number[] | null | undefined;
}) => {
  const response = await axios.post("/GrupoImagem", data,{ timeout: 1000000 });
  return response.data.data;
};

export const editGroupImages = async (groupImages: {
  id: number;
  name: string;
  tagsRequeridas: number[] | null|undefined
}) => {
  const response = await axios.post("/GrupoImagem", groupImages,{ timeout: 1000000 });
  return response.data.data;
};

export const deleteGroupImages = async (groupImagesId: number) => {
  const response = await axios.post(`/GrupoImagem/delete?id=${groupImagesId}`,{ timeout: 1000000 });
  return response.data.data;
};
