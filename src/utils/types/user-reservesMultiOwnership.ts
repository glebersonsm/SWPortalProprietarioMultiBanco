import {
  AppointmentBooking,
  IncomingAppointmentBooking,
} from "./multiownership/appointments";

export type IncomingUserAppointmentMultiOwnership = {
  id: number;
  periodoCotaDisponibilidadeId: number;
  dataInicial: string;
  dataFinal: string;
  tipoSemana: string;
  cotaId: string;
  cotaNome: string;
  uhCondominioId: number;
  uhCondominioNumero: string;
  tipoDisponibilizacaoNome: string;
  reservasVinculadas: string;
  nomeProprietario: string;
  DocumentoProprietario: string;
  hospedePrincipal: string;
  podeRetirarDoPool: boolean;
  podeLiberarParaPool: boolean;
  ano: string;
  reservas?: IncomingAppointmentBooking[];
};

export type UserAppointmentMultiOwnership = {
  id: number;
  periodCoteAvailabilityId: number;
  initialDate: string;
  finalDate: string;
  weekType: string;
  coteId: number;
  coteName: string;
  roomCondominiumId: number;
  roomNumber: string;
  availableTypeName: string;
  reservations: string;
  ownershipName: string;
  documentOwnership: string;
  mainGuestName: string;
  canReleasePool: boolean;
  canRemovePool: boolean;
  year: string;
  capacity: number;
  bookings?: AppointmentBooking[];
  hasSCPContract: boolean;
  idIntercambiadora: string;
  temIntercambiadora: boolean;
  tipoPessoa: string;
  pessoaTitular1Tipo: string;
  pessoaTitular1CPF: string;
  pessoaTitualar1CNPJ: string;
};

export type UserAppointmentsMultiOwnership = {
  appointments: UserAppointmentMultiOwnership[];
  lastPageNumber: number;
  pageNumber: number;
};

export type UserIncomingApppointmentAccountBank = {
  id: number;
  clienteId: number;
  codigoBanco: string;
  nomeBanco: string;
  agencia: string;
  agenciaDigito: string;
  contaNumero: string;
  contaDigito: string;
  idCidade: string;
  nomeCidade: string;
  siglaEstadoCidade: string;
  preferencial: string;
  tipoChavePix: string;
  descricaoTipoChavePix: string;
  chavePix: string;
  status: string;
  documentoTitularConta: string
};

export type UserApppointmentAccountBank = {
  id: number;
  name: string;
};

export type FiltersProps = {
  withoutReservation: boolean;
  year: string;
};
