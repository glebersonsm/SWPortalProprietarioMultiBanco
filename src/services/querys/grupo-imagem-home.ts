import axios from "@/services/AxiosInstance";
import { RequiredTags } from "@/utils/types/tags";
import { ImagemGrupoImagemHome } from "./imagem-grupo-imagem-home";
import { transformedGrupoImagemHome } from "../api/transformGrupoImagemHome";

export type GrupoImagemHome = {
  id?: number;
  companyId?: number;
  name?: string;
  images?: ImagemGrupoImagemHome[];
  tagsRequeridas?: RequiredTags[];
};

export type GrupoImagemHomeInput = {
  id?: number;
  companyId?: number;
  name: string;
  tagsRequeridas?: number[] | null;
};

export type SearchGrupoImagemHomeParams = {
  id?: number;
  nome?: string;
  usuarioCriacao?: number;
  numeroDaPagina?: number;
  quantidadeRegistrosRetornar?: number;
};

export const searchGrupoImagemHome = async (
  params: SearchGrupoImagemHomeParams
): Promise<GrupoImagemHome[]> => {
  const response = await axios.get("/GrupoImagemHome/search", {
    params: {
      Id: params.id,
      Nome: params.nome,
      UsuarioCriacao: params.usuarioCriacao,
      NumeroDaPagina: params.numeroDaPagina,
      QuantidadeRegistrosRetornar: params.quantidadeRegistrosRetornar || 10,
    },
    timeout: 1000000,
  });
  const data = response.data.data || [];
  return transformedGrupoImagemHome(data);
};

export const saveGrupoImagemHome = async (
  data: GrupoImagemHomeInput
): Promise<GrupoImagemHome> => {
  const payload = {
    ...data,
    TagsRequeridas: data.tagsRequeridas || null,
    RemoverTagsNaoEnviadas: true,
  };
  const response = await axios.post("/GrupoImagemHome", payload, {
    timeout: 1000000,
  });
  return response.data.data;
};

export const deleteGrupoImagemHome = async (id: number): Promise<void> => {
  await axios.post(`/GrupoImagemHome/delete?id=${id}`, null, {
    timeout: 1000000,
  });
};

