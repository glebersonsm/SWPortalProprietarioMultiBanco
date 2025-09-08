export type IncomingUserContract = {
  idVendaTs: number;
  idCliente: number;
  nomeCliente: string;
  documentoCliente: string;
  emailCliente: string;
  projetoXContrato: string;
  tipoContrato: string;
  cidade_Estado: string;
  dataVenda: string;
  status: string;
  numeroContrato: string;
  cancelado: string;
  dataCancelamento?: string;
  revertido: string;
  dataReversao?: string;
  salaVendas: string;
  saldoPontos: number;
  pessoaProviderId: number;
  valorEntrada?: number;
  qtdeParcelasEntrada: number;
  valorFinanciado: number;
  qtdeParcelasFinanciamento: number;
  qtdeParcelasPagas: number;
  valorTotalVenda: number;
  percentualIntegralizacao: number;
  dataValidade: string;
};

export type UserContract = {
  tsSaleId: number;
  clientId: number;
  clientName: string;
  clientDocument: string;
  clientEmail: string;
  projectXContract: string;
  contractType: string;
  cityState: string;
  saleDate: string;
  status: string;
  contractNumber: string;
  cancellation: string;
  cancellationDate?: string;
  reversed: string;
  reversalDate?: string;
  saleRoom: string;
  pointsBalance: number;
  personProviderId: number;
  downPayment?: number;
  numberOfDownPayments: number;
  amountFinanced: number;
  numberOfFinancedInstallments: number;
  numberOfInstallmentsPaid: number;
  totalSalesValue: number;
  percentagePaid: number;
  expirationDate: string;
};

export type UserContracts = {
  contracts: UserContract[];
  lastPageNumber: number;
  pageNumber: number;
};

export type FiltersProps = {
  contractNumber: string;
};
