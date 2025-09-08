import { RequiredTags, RequiredTagsWelcome } from "./tags";


export type FaqSent = {
 disponivel: number;
  grupoFaqId: number;
  id: number;
  pergunta: string;
  resposta: string;
  usuarioCriacao: number;
  tagsRequeridas: number[] | null;
  removerTagsNaoEnviadas: boolean;
};

export type IncomingFaq = {
  disponivel: number;
  grupoFaqId: number;
  id: number;
  pergunta: string;
  resposta: string;
  usuarioCriacao: number;
  tagsRequeridas: RequiredTagsWelcome[];
};

export type IncomingGroupFaq = {
  disponivel: number;
  empresaId: number;
  enviarPerguntaAoCliente: number;
  enviarRespostaAoCliente: number;
  id: number;
  nome: string;
  usuarioCriacao: number;
  faqs: IncomingFaq[];
  tagsRequeridas: RequiredTagsWelcome[];
};

export type FiltersProps = {
  textQuestion: string;
  textResponse: string;
};

// -------------- NEWS --------------

export type Faq = {
  available: boolean;
  groupFaqId: number;
  id: number;
  question: string;
  response: string;
  userCreation: number;
  requiredTags: RequiredTags[];
};

export type GroupFaq = {
  available: boolean;
  companyId: number;
  id: number;
  name: string;
  creationUser: number;
  faqs: Faq[];
  requiredTags?: RequiredTags[] | null;
};
