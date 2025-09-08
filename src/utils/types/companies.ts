import {
  Address,
  Document,
  IncomingUserAddress,
  IncomingUserDocument,
  IncomingUserPhone,
  Phone,
} from "./users";

export type IncomingGroupCompany = {
  id: number;
  empresaId: number;
  grupoEmpresaId: number;
  grupoEmpresaNome: string;
  pessoaJuridicaNome: string;
};

export type IncomingCompany = {
  id: number;
  pessoaEmpresa: {
    id: number;
    nome: string;
    nomeFantasia: string;
    emailPreferencial: string;
    emailAlternativa?: string;
    tipoPessoa: number;
    documentos: IncomingUserDocument[];
    enderecos: IncomingUserAddress[];
    telefones: IncomingUserPhone[];
    regimeTributario: number;
  };
  codigo: string;
  grupoEmpresaId: number;
};

export type GroupCompany = {
  id: number;
  companyId: number;
  groupCompanyId: number;
  groupCompanyName: string;
  companyName: string;
};

export type Company = {
  code: string;
  mainEmail: string;
} & CompanyUser;

export type CompanyUser = {
  companyId: number;
  name: string;
};

export type CompleteCompany = Company & {
  id: number;
  alternativeEmail?: string;
  fantasyName: string;
  groupCompanyId: number;
  personType: number;
  taxRegime: number;
  documents: Document[];
  addresses: Address[];
  phones: Phone[];
};

export type CompanyPayload = {
  id: number;
  grupoEmpresaId: number;
  pessoa: {
    id: number;
    razaoSocial: string;
    nomeFantasia: string;
    emailPreferencial: string;
    emailAlternativo?: string;
    tipoPessoa: number;
    regimeTributario: number;
    documentos: IncomingUserDocument[];
    enderecos: IncomingUserAddress[];
    telefones: IncomingUserPhone[];
  };
};
