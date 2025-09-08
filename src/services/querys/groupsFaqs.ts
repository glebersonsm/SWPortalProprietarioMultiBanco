import axios from "@/services/AxiosInstance";
import { transformedGroupFaqs } from "../api/transformGroupFaqs";
import { FiltersProps } from "@/utils/types/faqs";

type createGroupFaqProps = {
  nome: string;
  disponivel: number;
  tagsRequeridas: number[] | null;
};

type editGroupFaqProps = createGroupFaqProps & {
  id: number;
};

export const getGroupFaqs = async ({
  debounceFilters,
}: {
  debounceFilters: FiltersProps;
}) => {
  const response = await axios.get("/GrupoFaq/search", {
    params: {
      RetornarFaqs: true,
      TextoPergunta: debounceFilters.textQuestion,
      TextoResposta: debounceFilters.textResponse,
    },
    timeout: 1000000,
  });
  return transformedGroupFaqs(response.data.data);
};

export const createGroupFaqs = async (groupFaqs: createGroupFaqProps) => {
  const response = await axios.post("/GrupoFaq", groupFaqs, {
    timeout: 1000000,
  });
  return response.data.data;
};

export const editGroupFaqs = async (groupFaqs: editGroupFaqProps) => {
  const response = await axios.post("/GrupoFaq", groupFaqs, {
    timeout: 1000000,
  });
  return response.data.data;
};

export const deleteGroupFaqs = async (groupFaqId: number) => {
  const response = await axios.post(`/GrupoFaq/delete?id=${groupFaqId}`, {
    timeout: 1000000,
  });
  return response.data.data;
};
