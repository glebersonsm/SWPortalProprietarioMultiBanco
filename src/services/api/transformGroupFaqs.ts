import { GroupFaq, IncomingGroupFaq } from "@/utils/types/faqs";

export function transformedGroupFaqs(groupsFaqs: IncomingGroupFaq[]) {
  return groupsFaqs.map((groupFaqs) => {
    const requiredTags = groupFaqs.tagsRequeridas?.map((tag) => {
      return {
        id: tag.tags.id,
        name: tag.tags.nome,
      };
    });
    const faqs = groupFaqs?.faqs?.map((faq) => {
      const requiredTagsItem = faq.tagsRequeridas?.map((tag) => {
        return {
          id: tag.tags.id,
          name: tag.tags.nome,
        };
      });


      return {
        available: !!faq.disponivel,
        groupFaqId: faq.grupoFaqId,
        id: faq.id,
        question: faq.pergunta,
        response: faq.resposta,
        userCreation: faq.usuarioCriacao,
        requiredTags: requiredTagsItem,
      };
    });

    return {
      id: groupFaqs.id,
      name: groupFaqs.nome,
      creationUser: groupFaqs.usuarioCriacao,
      companyId: groupFaqs.empresaId,
      available: !!groupFaqs.disponivel,
      sendQuestionToCustomer: !!groupFaqs.enviarPerguntaAoCliente,
      sendResponseToCustomer: !!groupFaqs.enviarRespostaAoCliente,
      faqs: faqs,
      requiredTags: requiredTags,
    };
  });
}

export function untransformedGroupFaqs(groupFaqs: GroupFaq) {
  return {
    id: groupFaqs.id,
    nome: groupFaqs.name,
    empresaId: groupFaqs.companyId,
    disponivel: groupFaqs.available ? 1 : 0,
    tagsRequeridas: groupFaqs.requiredTags?.length
      ? groupFaqs.requiredTags.map((tag) => tag.id)
      : null,
  };
}
