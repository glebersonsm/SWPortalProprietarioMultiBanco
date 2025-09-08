import { CompanyUser, GroupCompany, IncomingGroupCompany } from "./companies";
import { RequiredTags, RequiredTagsWelcome } from "./tags";

export type UserProps = {
  id: number;
  pessoaId: number;
  nomePessoa: string;
  login: string;
  status: number;
  administrador: number;
  gestorFinanceiro: number;
  gestorReservasAgendamentos: number;
  pessoa: PersonProps;
};

export type UserWelcome = UserProps & {
  tagsRequeridas?: RequiredTagsWelcome[] | [];
  usuarioEmpresas?: IncomingGroupCompany[] | [];
};

export type UserSent = UserProps & {
  tagsRequeridas?: number[] | null;
  removerTagsNaoEnviadas: boolean;
  removerEmpresasNaoEnviadas: boolean;
  usuarioEmpresas?: number[] | null;
};

export type PersonProps = {
  id: number;
  nome: string;
  emailPreferencial: string;
  tipoPessoa: number;
  documentos?: IncomingUserDocument[] | null;
  enderecos?: IncomingUserAddress[] | null;
  telefones?: IncomingUserPhone[] | null;
};

export type IncomingUserAddress = {
  bairro: string;
  cep: string;
  cidadeId: number;
  cidadeNome: string;
  id: number;
  logradouro: string;
  numero: string;
  preferencial: number;
  tipoEnderecoId: number;
  tipoEnderecoNome: string;
};

export type IncomingUserPhone = {
  id: number;
  numero: string;
  numeroFormatado?: string;
  preferencial: number;
  tipoTelefoneId: number;
  tipoTelefoneNome: string;
};

export type IncomingUserDocument = {
  id: number;
  tipoDocumentoId: number;
  tipoDocumentoNome: string;
  numeroFormatado?: string;
  numero: string;
  orgaoEmissor?: string;
  dataEmissao?: string;
  dataValidade?: string;
};

export type ListUsersProps = {
  users: UserProps[];
};

export type FiltersProps = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  userType?: number;
};

export type IncomingDocumentTypes = {
  id: number;
  nome: string;
  exigeDataEmissao: number;
  exigeDataValidade: number;
  exigeOrgaoEmissor: number;
  mascara: string;
  tipoPessoa: number;
};

export type IncomingAddressTypes = {
  id: number;
  nome: string;
};

export type IncomingPhoneTypes = {
  id: number;
  nome: string;
};

export type EditUserProps = UserProps & { removerTagsNaoEnviadas: number };

// -------------- NEWS --------------

export type User = {
  isAdm: boolean;
  id: number;
  login: string;
  name: string;
  personId: number;
  gestorFinanceiro: number;
  gestorReservasAgendamentos: number;
  personType: number;
  isActive: boolean;
  integratedWithTimeSharing?: boolean;
  integratedWithMultiOwnership?: boolean;
  email: string;
};

export type AuthUser = User & {
  companies: GroupCompany[];
};

export type CompleteUser = User & {
  documents?: Document[] | null;
  addresses?: Address[] | null;
  phones?: Phone[] | null;
  requiredTags?: RequiredTags[] | null;
  companies?: CompanyUser[] | null;
};

export type Users = {
  users: CompleteUser[];
  lastPageNumber: number;
  pageNumber: number;
};

export type CompleteUserSent = CompleteUser & {
  removeUnsetTags: boolean;
  removeUnsetCompanies: boolean;
};

export type Person = {
  id: number;
  name: string;
  personType: number;
  email: string;
};

export type Document = {
  id: number;
  number: string;
  formattedNumber?: string;
  documentTypeId: number;
  documentTypeName: string;
  dateOfIssue?: string;
  expiryDate?: string;
  issuingBody?: string;
};

export type Address = {
  neighborhood: string;
  cep: string;
  cityId: number;
  cityName: string;
  id: number;
  street: string;
  number: string;
  isPreferential: boolean;
  addressTypeId: number;
  addressTypeName: string;
};

export type Phone = {
  id: number;
  number: string;
  phoneTypeId: number;
  phoneTypeName: string;
  isPreferential: boolean;
};

export type DocumentTypes = {
  id: number;
  name: string;
  requiresIssueDate: boolean;
  requiresDueDate: boolean;
  requiresIssuingBody: boolean;
  mask: string;
  personType: number;
};

export type AddressTypes = {
  id: number;
  name: string;
};

export type PhoneTypes = {
  id: number;
  name: string;
};

export type ChangeUserPassword = {
  actualPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};
