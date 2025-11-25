import axios from "@/services/AxiosInstance";

export type ImageGroupImageInput = {
  id?: number;
  imageGroupId: number;
  name: string;
  imagem?: File; // Opcional na edição
  tagsRequeridas?: number[] | null;
  nomeBotao?: string;
  linkBotao?: string;
  dataInicioVigencia?: string;
  dataFimVigencia?: string;
};

type addImageProps = {
  image: {
    name: string;
    url: FileList;
  };
  groupImageId: number;
  tagsRequeridas: number[] | null | undefined;
};

export const addImage = async ({ image, groupImageId, tagsRequeridas }: addImageProps) => {
  const formData = new FormData();

  formData.append("Name", image.name);
  if (image.url && image.url.length > 0) {
    formData.append("Imagem", image.url[0]);
  }
  formData.append("ImageGroupId", String(groupImageId));

  if (tagsRequeridas && tagsRequeridas.length > 0) {
    tagsRequeridas.forEach((tagId) => {
      formData.append("TagsRequeridas", String(tagId));
    });
  }
  formData.append("RemoverTagsNaoEnviadas", "true");

  const response = await axios.post("/ImagemGrupoImagem", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 1000000,
  });

  return response.data.data;
};

export const saveImageGroupImage = async (data: ImageGroupImageInput) => {
  const formData = new FormData();
  
  if (data.id) {
    formData.append("Id", String(data.id));
  }
  formData.append("ImageGroupId", String(data.imageGroupId));
  formData.append("Name", data.name);
  
  // Só adiciona a imagem se houver uma nova imagem selecionada
  if (data.imagem && data.imagem instanceof File && data.imagem.size > 0) {
    formData.append("Imagem", data.imagem);
  }
  
  if (data.tagsRequeridas && data.tagsRequeridas.length > 0) {
    data.tagsRequeridas.forEach((tagId) => {
      formData.append("TagsRequeridas", String(tagId));
    });
  }
  formData.append("RemoverTagsNaoEnviadas", "true");
  
  if (data.nomeBotao) {
    formData.append("NomeBotao", data.nomeBotao);
  }
  if (data.linkBotao) {
    formData.append("LinkBotao", data.linkBotao);
  }
  if (data.dataInicioVigencia) {
    formData.append("DataInicioVigencia", data.dataInicioVigencia);
  }
  if (data.dataFimVigencia) {
    formData.append("DataFimVigencia", data.dataFimVigencia);
  }

  const response = await axios.post("/ImagemGrupoImagem", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 1000000,
  });
  return response.data.data;
};

export type EditImageProps = {
  id: number
  tagsRequeridas: number[] | null | undefined;
};

export const EditImage = async (data : EditImageProps) => {
  const response = await axios.post("/ImagemGrupoImagem/edit", data, {
    timeout: 1000000,
  });
  return response.data.data;
};

export const deleteImage = async (imageId: number) => {
  const response = await axios.post(`/ImagemGrupoImagem/delete?id=${imageId}`, {
    timeout: 1000000,
  });
  return response.data.data;
};
