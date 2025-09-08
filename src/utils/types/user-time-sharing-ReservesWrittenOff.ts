export type IncomingUserReserveWrittenOff = {
  projetoXContrato: string;
  numeroContrato: string;
  numReserva: string;
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

export type UserReserveWrittenOff = {
  projectXContract: string;
  contractNumber: string;
  reserveNumber: string;
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

export type UserReservesWrittenOff = {
  reservesWrittenOff: UserReserveWrittenOff[];
  lastPageNumber: number;
  pageNumber: number;
};

export type FiltersProps = {
  reserveNumber: string;
  contractNumber: string;
  reserveStatus: string | null;
  initialCheckin: string;
  finalCheckin: string;
  initialCheckout: string;
  finalCheckout: string;
};
