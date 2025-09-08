import axios from "@/services/AxiosInstance";

type addImageProps = {
  image: {
    name: string;
    url: FileList;
  };
  groupImageId: number;
  tagsRequeridas: number[] | null | undefined;
};

export const addImage = async ({ image, groupImageId, tagsRequeridas }: addImageProps) => {
  const form = new FormData();

  form.append("name", image.name);
  form.append("image", image.url[0]);
  form.append("imageGroupId", String(groupImageId));

  if (tagsRequeridas) {
    // Supondo que o backend aceite uma lista separada por vírgula
    form.append("tagsRequeridas", tagsRequeridas.join(","));
    // Se o backend esperar JSON: use isso no lugar da linha acima
    // form.append("tagsRequeridas", JSON.stringify(tagsRequeridas));
  }

  const response = await axios.post("/ImagemGrupoImagem", form, {
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
