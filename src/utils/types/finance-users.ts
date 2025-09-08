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
