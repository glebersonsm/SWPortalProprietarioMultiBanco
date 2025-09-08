export type IncomingContract = {
  idVendaTs: number;
  idCliente: number;
  nomeCliente: string;
  documentoCliente: string;
  projetoXContrato: string;
  emailCliente: string;
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

export type Contract = {
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

export type Contracts = {
  contracts: Contract[];
  lastPageNumber: number;
  pageNumber: number;

};

export type FiltersProps = {
  clientName: string;
  contractNumber: string;
  clientDocument: string;
  contractType: string;
  projectXContract: string;
  status: string | null;
  initialSaleDate: string;
  finalSaleDate: string;
  initialCancellationDate: string;
  finalCancellationDate: string;
  tsSaleId: string;
  saleRoom: string;
};
