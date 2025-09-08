import axios from "@/services/AxiosInstance";
import { Faq, FaqSent, IncomingFaq } from "@/utils/types/faqs";

type editProps = {
  faq: FaqSent;
  groupFaqId: number;
};

type createProps = {
  faq: {
    resposta: string;
    pergunta: string;
    disponivel: number;
    tagsRequeridas: number[]| null
  };
  groupFaqId: number;
};

export const getFaqs = async (): Promise<Faq[]> => {
  const response = await axios.get("/Faq/search", {});
  const faqs = response.data.data;

  return faqs.map((faq: IncomingFaq) => {
    return {
      groupFaqId: faq.grupoFaqId,
      id: faq.id,
      question: faq.pergunta,
      response: faq.resposta,
    };
  });
};

export const createFaq = async ({ faq, groupFaqId }: createProps) => {
  const response = await axios.post("/Faq", { ...faq, grupoFaqId: groupFaqId });
  return response.data.data;
};

export const editFaq = async ({ faq, groupFaqId }: editProps) => {
  const response = await axios.post("/Faq", { ...faq, grupoFaqId: groupFaqId });
  return response.data.data;
};

export const deleteFaq = async (faqId: number) => {
  const response = await axios.post(`/Faq/delete?id=${faqId}`);
  return response.data.data;
};
