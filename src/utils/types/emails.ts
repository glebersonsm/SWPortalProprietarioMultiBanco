export type IncomingEmail = {
  id: number;
  dataHoraCriacao: string;
  usuarioCriacao: number;
  dataHoraAlteracao: string;
  usuarioAlteracao: number;
  empresaId: number;
  assunto: string;
  destinatario: string;
  conteudoEmail: string;
  enviado: number;
  nomeUsuarioCriacao: string;
  nomeUsuarioAlteracao: string;
};

export type Email = {
  id: number;
  creationDate: string;
  creationUser: number;
  creationUsername: string;
  changeUsername: string;
  changeDate: string;
  changeUser: number;
  companyId: number;
  subject: string;
  recipient: string;
  content: string;
  sent: boolean;
};

export type Emails = {
  emails: Email[];
  lastPageNumber: number;
  pageNumber: number;
};

export type FiltersProps = {
  id: string;
  initialCreationDate: string;
  finalCreationDate: string;
  initialShippingDate: string;
  finalShippingDate: string;
  sent: string | null;
  recipient: string;
  subject: string;
};
