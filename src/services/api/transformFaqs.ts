import { Faq } from "@/utils/types/faqs";
import { untransformedTags } from "./transformTags";

export function untransformedFaq(
  faq: Faq  & { removeUnsetTags: boolean }
) {
  return {
    grupoFaqId: faq.groupFaqId,
    id: faq.id,
    pergunta: faq.question,
    disponivel: faq.available ? 1 : 0,
    resposta: faq.response,
    usuarioCriacao: faq.userCreation,
    tagsRequeridas: untransformedTags(faq.requiredTags),
    removerTagsNaoEnviadas: false,
  };
}
