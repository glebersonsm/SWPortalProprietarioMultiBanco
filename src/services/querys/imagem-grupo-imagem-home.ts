import axios from "@/services/AxiosInstance";
import { transformImagemGrupoImagemHome } from "../api/transformImagemGrupoImagemHome";
import { RequiredTags } from "@/utils/types/tags";

export type ImagemGrupoImagemHome = {
  id?: number;
  grupoImagemHomeId?: number;
  grupoImagemHomeName?: string;
  name?: string;
  imagem?: string; // base64
  imagemBase64?: string; // base64
  nomeBotao?: string;
  linkBotao?: string;
  ordem?: number;
  dataInicioVigencia?: string;
  dataFimVigencia?: string;
  tagsRequeridas?: RequiredTags[];
};

export type ImagemGrupoImagemHomeInput = {
  id?: number;
  grupoImagemHomeId: number;
  name: string;
  imagem?: File; // Opcional na edição
  nomeBotao?: string;
  linkBotao?: string;
  ordem?: number;
  dataInicioVigencia?: string;
  dataFimVigencia?: string;
  tagsRequeridas?: number[] | null;
};

export type SearchImagemGrupoImagemHomeParams = {
  id?: number;
  grupoImagemHomeId?: number;
  nome?: string;
  usuarioCriacao?: number;
  numeroDaPagina?: number;
  quantidadeRegistrosRetornar?: number;
};

export const searchImagemGrupoImagemHome = async (
  params: SearchImagemGrupoImagemHomeParams
): Promise<ImagemGrupoImagemHome[]> => {
  const response = await axios.get("/ImagemGrupoImagemHome/search", {
    params: {
      Id: params.id,
      GrupoImagemHomeId: params.grupoImagemHomeId,
      Nome: params.nome,
      UsuarioCriacao: params.usuarioCriacao,
      NumeroDaPagina: params.numeroDaPagina,
      QuantidadeRegistrosRetornar: params.quantidadeRegistrosRetornar || 10,
    },
    timeout: 1000000,
  });
  const data = response.data.data || [];
  return transformImagemGrupoImagemHome(data);
};

export const saveImagemGrupoImagemHome = async (
  data: ImagemGrupoImagemHomeInput
): Promise<ImagemGrupoImagemHome> => {
  const formData = new FormData();
  
  if (data.id) {
    formData.append("Id", String(data.id));
  }
  formData.append("GrupoImagemHomeId", String(data.grupoImagemHomeId));
  formData.append("Name", data.name);
  
  // Só adiciona a imagem se houver uma nova imagem selecionada
  // Se for edição e não houver nova imagem, não adiciona o campo
  // e o backend mantém a imagem existente
  if (data.imagem && data.imagem instanceof File && data.imagem.size > 0) {
    formData.append("Imagem", data.imagem);
  }
  
  if (data.nomeBotao) {
    formData.append("NomeBotao", data.nomeBotao);
  }
  if (data.linkBotao) {
    formData.append("LinkBotao", data.linkBotao);
  }
  if (data.ordem !== undefined && data.ordem !== null) {
    formData.append("Ordem", String(data.ordem));
  }
  if (data.dataInicioVigencia) {
    formData.append("DataInicioVigencia", data.dataInicioVigencia);
  }
  if (data.dataFimVigencia) {
    formData.append("DataFimVigencia", data.dataFimVigencia);
  }
  
  if (data.tagsRequeridas && data.tagsRequeridas.length > 0) {
    data.tagsRequeridas.forEach((tagId) => {
      formData.append("TagsRequeridas", String(tagId));
    });
  }
  formData.append("RemoverTagsNaoEnviadas", "true");

  const response = await axios.post("/ImagemGrupoImagemHome", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 1000000,
  });
  return response.data.data;
};

export const deleteImagemGrupoImagemHome = async (id: number): Promise<void> => {
  await axios.post(`/ImagemGrupoImagemHome/delete?id=${id}`, null, {
    timeout: 1000000,
  });
};

export const searchImagemGrupoImagemHomeForHome = async (): Promise<ImagemGrupoImagemHome[]> => {
  const response = await axios.get("/ImagemGrupoImagemHome/searchForHome", {
    timeout: 1000000,
  });
  const data = response.data.data || [];
  return transformImagemGrupoImagemHome(data);
};

