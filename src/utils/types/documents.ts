import { RequiredTags, RequiredTagsWelcome } from "./tags";

export type DocumentProps = {
  id: number;
  nome: string;
  path: FileList;
  disponivel: number;
  grupoDocumentoId: number;
  usuarioCriacao: number;
};

export type IncomingDocuments = DocumentProps & {
  tagsRequeridas: RequiredTagsWelcome[];
};
export type DocumentSent = DocumentProps & {
  tagsRequeridas: number[];
  removerTagsNaoEnviadas: boolean;
};

export type IncomingDocumentHistory = {
  acaoRealizada: string;
  dataOperacao: string;
  documentoId: number;
  documentoNome: string;
  grupoDocumentoId: number;
  grupoDocumentoNome: string;
  nomeUsuario: string;
  usuarioId: number;
};

export type GroupOfDocsProps = {
  id: number;
  nome: string;
  empresaId: number;
  disponivel: number;
};

export type IncomingGroupOfDocs = GroupOfDocsProps & {
  tagsRequeridas: RequiredTagsWelcome[];
  documentos: IncomingDocuments[];
};
export type GroupOfDocsSent = GroupOfDocsProps & {
  tagsRequeridas: number[];
  removerTagsNaoEnviadas: boolean;
};

// -------------- NEWS --------------

export type GroupOfDocs = {
  id: number;
  name: string;
  requiredTags: RequiredTags[];
  companyId: number;
  available: boolean;
  documents: Document[];
};

export type Document = {
  id: number;
  name: string;
  requiredTags: RequiredTags[];
  path: FileList;
  available: boolean;
  groupDocumentId: number;
  creationUser: number;
};

export type DocumentHistory = {
  action: string;
  date: string;
  userId: number;
  userName: string;
};

export type FiltersProps = {
  id: string;
  name: string;
  creationUser: string;
};
