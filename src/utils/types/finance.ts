export type IncomingOutstandingBill = {
  id: number;
  empresaId: number;
  empresaNome: string;
  pessoaProviderId: number;
  pessoaId: number;
  nomePessoa: string;
  dataHoraCriacao: string;
  dataHoraBaixa: string;
  vencimento: string;
  codigoTipoConta: string;
  nomeTipoConta: string;
  valor: number;
  valorAtualizado: number;
  linhaDigitavelBoleto: string;
  observacao: string;
  contrato: string;
  statusParcela: string;
  statusCrcBloqueiaPagamento: string;
  dataProcessamento: string;
};

export type OutstandingBill = {
  id: number;
  companyId: number;
  companyName: string;
  personProviderId: number;
  personId: number;
  personName: string;
  dueDate: string;
  paymentDate: string;
  accountTypeCode: string;
  accountTypeName: string;
  value: number;
  currentValue: number;
  typeableBillLine: string;
  observation: string;
  creationDate: string;
  contrato: string;
  status: string;
  paymentBlockedByCrcStatus: string;
  processingDate: string;
};

export type OutstandingBills = {
  outstandingBills: OutstandingBill[];
  lastPageNumber: number;
  pageNumber: number;
};

export type FiltersOutstandingBills = {
  initialDueDate: string;
  finalDueDate: string;
  personName: string;
  companyId: number;
  status: string | null;
};

export type IncomingTokenizedCard = {
  id: number;
  pessoaProviderId: number;
  pessoaId: number;
  dataHoraCriacao: string;
  pessoaNome: string;
  token: string;
  token2: string;
  cardHolder: string;
  card: {
    brand: string;
    card_number: string;
    cvv: string;
    due_date: string;
    card_holder: string;
  };
  company: {
    id: string;
    token: string;
    acquirer: string;
  };
  status: string;
};

export type TokenizedCard = {
  id: number;
  personProviderId: number;
  personId: number;
  personName: string;
  creationDate: string;
  token: string;
  token2: string;
  cardHolder: string;
  card: {
    brand: string;
    card_number: string;
    cvv: string;
    due_date: string;
    card_holder: string;
  };
  company: {
    id: string;
    token: string;
    acquirer: string;
  };
  status: string;
};

export type FiltersTokenizedCards = {
  personName: string;
  personId: string;
};

export type FiltersUserTokenizedCards = FiltersTokenizedCards & {
  personProviderId: string;
};

export type IncomingTransaction = {
  paymentId: string;
  pessoaId: string;
  pessoaNome: string;
  pix: boolean;
  cartao: boolean;
  valorTransacao: number;
  status: string;
  dataTransacao: string;
  nsu: string;
  autorizacao: string;
  adquirente: string;
  transactionId: string;
  chave: string;
  hashCode: string;
  dadosEnviados: string;
  retorno: string;
  qrCode: string;
  url: string;
  contasVinculadas: IncomingLinkedAccount[];
};

export type IncomingLinkedAccount = {
  vencimento: string;
  itemId: number;
  valor: number;
  valorNaTransacao: number;
  descricaoDoItem: string;
};

export type Transaction = {
  paymentId: string;
  personId: string;
  personName: string;
  pix: boolean;
  card: boolean;
  value: number;
  status: string;
  date: string;
  nsu: string;
  authorization: string;
  acquirer: string;
  transactionId: string;
  hashCodeId: string;
  keyValue: string;
  sentData: string;
  receivedData: string;
  qrCode: string;
  url: string;
  linkedAccounts: LinkedAccount[];
};

export type Transactions = {
  transactions: Transaction[];
  lastPageNumber: number;
  pageNumber: number;
};

export type LinkedAccount = {
  dueDate: string;
  id: number;
  value: number;
  itemDescription: string;
  valueOnTransaction: number;
};

export type FiltersTransactions = {
  initialDate: string;
  finalDate: string;
  personName: string;
  personId: string;
  paymentStatus: string | null;
  paymentType: string | null;
  companyId: number;
};
