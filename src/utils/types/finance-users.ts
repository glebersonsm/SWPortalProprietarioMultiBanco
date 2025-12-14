import {
  IncomingOutstandingBill,
  IncomingTokenizedCard,
  OutstandingBill,
  TokenizedCard,
} from "./finance";

export type IncomingUserOutstandingBill = IncomingOutstandingBill;

export type UserOutstandingBill = OutstandingBill;

export type UserOutstandingBills = {
  outstandingBills: UserOutstandingBill[];
  lastPageNumber: number;
  pageNumber: number;
};

export type FiltersUserOutstandingBills = {
  initialDueDate: string;
  finalDueDate: string;
  status: string | null;
  companyId: number;
};

export type PropsToGenerateQRCode = {
  personId: number;
  totalValue: number;
  ids: number[];
  idEmpresa?: number;
  idTorre?: number | null;
  idContrato?: string | null;
  contrato?: string | null;
  contasFinanceiras?: PixContaFinanceiraRequest[];
};

export type PixContaFinanceiraRequest = {
  idContaFinanceira: number;
  valor: number;
  dataVencimento?: string;
  valorJuros?: number;
  valorMulta?: number;
};

export type PropsToPayByCard = {
  personId: number;
  totalValue: number;
  ids: number[];
  tokenizedCardId: number;
};

export type IncomingUserTokenizedCard = IncomingTokenizedCard;

export type UserTokenizedCard = TokenizedCard;

export type UserTokenizedCards = {
  tokenizedCards: UserTokenizedCard[];
  lastPageNumber: number;
  pageNumber: number;
};
export type FiltersUserTokenizedCards = {
  personProviderId: string;
  personId: string;
};

export type PayWithSavedCardRequestBody = {
  idCartaoSalvo: number;
  contasFinanceiras: {
    idContaFinanceira: number;
    valor: number;
    dataVencimento: string;
    valorJuros?: number;
    valorMulta?: number;
  }[];
  idEmpresa: number;
  idTorre?: number | null;
  idContrato?: number | null;
  Contrato?: string | null;
  numeroParcelas: number;
};

export type SavedCard = {
  id: number;
  ultimosDigitos: string;
  mesValidade: number;
  anoValidade: number;
  nomeNoCartao: string;
  bandeira: string;
  numero?: string; // Número ofuscado para exibição
};

// Alias para compatibilidade (pode ser removido depois)
export type SavedCardTse = SavedCard;

export type SaveCardRequest = {
  numeroCartao: string;
  codigoSeguranca: string;
  mesValidade: number;
  anoValidade: number;
  nomeNoCartao: string;
  cpfTitular?: string;
  idBandeira?: number;
  bandeira?: string;
  idEmpresa?: number;
  idTorre?: number | null;
  idContrato?: number | null;
};

export type BandeiraAceita = {
  id: number;
  bandeira: string;
};

export interface PayWithNewCardRequestBody {
  cartao: {
    numeroCartao: string;
    codigoSeguranca: string;
    mesValidade: string;
    anoValidade: string;
    nomeNoCartao: string;
    idBandeira?: number;
  };
  salvarCartao: boolean;
  contasFinanceiras: Array<{
    idContaFinanceira: number;
    valor: number;
    dataVencimento: string;
    valorJuros?: number;
    valorMulta?: number;
  }>;
  idEmpresa: number;
  idTorre?: number | null;
  idContrato?: number | null;
  Contrato?: number | null;
  numeroParcelas: number;
}

export type AddTokenizedCardData = {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
};

export type Certificate = {
  issueAt: string;
  competence: string;
  quota: string;
  documentNumber: string;
  propertyNumber: string;
  propertyName: string;
  documentName: string;
  protocol: string;
  numberTowerOrBLock: string;
};
