export type IncomingReserveWrittenOff = {
  projetoXContrato: string;
  numeroContrato: string;
  numReserva: number;
  idVendaTs: number;
  listaEspera: string;
  taxaIsenta: string;
  nomeCliente: string;
  hotel: string;
  codTipoUh: string;
  tipoUH: string;
  checkin: string;
  checkout: string;
  statusReserva: string;
  dataConfirmacao: string;
  dataCancelamento: string;
  fracionamento: string;
  adultos: number;
  criancas1: number;
  criancas2: number;
  pontoReserva: number;
  criadaPor: string;
  tipoLancamento: string;
  tipoReserva: string;
  valorPensao: number;
  valorPonto: number;
  valorPontos: number;
};

export type ReserveWrittenOff = {
  projectXContract: string;
  contractNumber: string;
  reserveNumber: number;
  tsSaleId: number;
  waitingList: string;
  taxExempt: string;
  clientName: string;
  hotel: string;
  uhCodeType: string;
  uhType: string;
  checkin: string;
  checkout: string;
  reserveStatus: string;
  confirmationDate: string;
  cancellationDate: string;
  fractionation: string;
  adults: number;
  children1: number;
  children2: number;
  reservationPoint: number;
  createdBy: string;
  launchType: string;
  reserveType: string;
  pensionAmount: number;
  pointValue: number;
  pointsValue: number;
  pointsAmount: number;
};

export type ReservesWrittenOff = {
  reservesWrittenOff: ReserveWrittenOff[];
  lastPageNumber: number;
  pageNumber: number;
};

export type FiltersProps = {
  showAllHosts: boolean;
  reserveNumber: string;
  contractNumber: string;
  clientName: string;
  hotel: string;
  clientDocument: string;
  reserveStatus: string | null;
  initialCheckin: string;
  finalCheckin: string;
  initialCheckout: string;
  finalCheckout: string;
};
