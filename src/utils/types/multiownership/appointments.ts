export type IncomingAppointmentBooking = {
  id: number;
  dataReserva: string;
  checkin: string;
  checkout: string;
  tipoUso: string;
  tipoSemana: string;
  status: string;
  tipoPensao: string;
  tipoHospede: string;
  tipoUhNome: string;
  tipoTarifacao: string;
  adultos: number;
  criancas1: number;
  criancas2: number;
  hotelNome: string;
  nomeHospede: string;
  periodoCotaDisponibilidadeId: number;
  cota: string;
  proprietarioNome: string;
  proprietarioCpfCnpj: string;
  proprietarioId: number;
  uhCondominioId: number;
  hospedes?: IncomingBookingGuests[];
  tipoUtilizacao: string;
  capacidade: number;
};

export type IncomingBookingGuests = {
  id?: number;
  clienteId?: number;
  principal?: string;
  nome?: string;
  cpf?: string;
  dataNascimento?: string | null;
  email?: string;
  sexo?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  cidadeNome?: string;
  cidadeId?: number;
  cidadeFormatada?: string;
  uf?: string;
  cep?: string;
  paisNome?: string;
};

export type IncomingAppointmentEditBooking = Omit<
  IncomingAppointmentBooking,
  | "dataReserva"
  | "tipoHospede"
  | "tipoUhNome"
  | "tipoTarifacao"
  | "tipoPensao"
  | "adultos"
  | "criancas1"
  | "criancas2"
  | "hotelNome"
  | "nomeHospede"
  | "periodoCotaDisponibilidadeId"
  | "cota"
  | "proprietarioNome"
  | "proprietarioCpfCnpj"
  | "proprietarioId"
  | "uhCondominioId"
  | "capacidade"
> & {
  hospedes?: IncomingBookingGuests[];
  quantidadeAdultos: number;
  quantidadeCrianca1: number;
  quantidadeCrianca2: number;
  tipoUtilizacao: string;
};


export type IncomingAppointmentMultiOwnership = {
  id: number;
  periodoCotaDisponibilidadeId: number;
  dataInicial: string;
  dataFinal: string;
  tipoSemana: string;
  cotaId: number;
  cotaNome: string;
  uhCondominioId: number;
  uhCondominioNumero: string;
  tipoDisponibilizacaoNome: string;
  tipoDisponibilizacao: string;
  tipoUtilizacao: string;
  reservasVinculadas: string;
  nomeProprietario: string;
  documentoProprietario: string;
  hospedePrincipal: string;
  ano: string;
  podeRetirarDoPool: boolean;
  TipoUso: string;
  podeLiberarParaPool: boolean;
  podeForcarAlteracao: boolean;
  capacidade: number;
  reservas?: IncomingAppointmentBooking[];
  possuiContratoSCP: boolean;
  idIntercambiadora: string;
  tipoPessoa: string;
  temIntercambiadora: boolean;
  pessoaTitular1Tipo: string;
  pessoaTitular1CPF: string;
  pessoaTitualar1CNPJ: string;
};

export type IncomingAppointmentInventory = {
  id: number;
  inventarioId: number;
  codigo: string;
  nome: string;
  nomeExibicao: string;
  pool: string;
};

export type AppointmentBooking = {
  id: number;
  reserveDate: string;
  checkin: string;
  checkout: string;
  weekType: string;
  status: string;
  pensionType: string;
  hostType: string;
  uhNameType: string;
  pricingType: string;
  adults: number;
  children1: number;
  children2: number;
  hotelNome: string;
  hostName: string;
  periodCoteAvailabilityId: number;
  cote: string;
  usageType: string;
  ownerName: string;
  ownerCpfCnpj: string;
  ownerId: number;
  uhCondominiumId: number;
  tipoUtilizacao: string;
  capacidade: number;
};

export type BookingGuest = {
  id?: number;
  clientId?: number;
  main?: boolean;
  name?: string;
  cpf?: string;
  birthday?: string | null;
  email?: string;
  sex?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  cityName?: string;
  cityId?: number;
  cityFormatted?: string;
  uf?: string;
  cep?: string;
  countryName?: string;
};

export type AppointmentEditBooking = AppointmentBooking & {
  guests?: BookingGuest[];
  canChangeMainHostData?: boolean;
  availableTypeName?: string;
};

export type AppointmentMultiOwnership = {
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
  year: string;
  canReleasePool: boolean;
  canRemovePool: boolean;
  canForceUpdate: boolean;
  bookings?: AppointmentBooking[];
};

export type AppointmentsMultiOwnership = {
  appointments: AppointmentMultiOwnership[];
  lastPageNumber: number;
  pageNumber: number;
};

export type AppointmentInventory = {
  id: number;
  code: string;
  name: string;
  displayName: string;
  pool: string;
};

export type IncomingApppointmentAccountBank = {
  id: number;
  nomeNormalizado: string;
};

export type ApppointmentAccountBank = {
  id: number;
  clientId: number;
  bankCode: string;
  bankName: string;
  agency: string;
  agencyDigit: string;
  accountNumber: string;
  accountDigit: string;
  cityId: string;
  cityName: string;
  initialsStateCity: string;
  preference: string;
  pixKeyType: string;
  descriptionTypePixKey: string;
  pixKey: string;
  status: string;
};

export type FiltersProps = {
  periodCoteAvailabilityId: string;
  reserveNumber: string;
  clientName: string;
  clientDocument: string;
  onlyWithReservation: string | null;
  intialDate: string;
  finalDate: string;
  ownershipCoteName: string;
  roomNumber: string;
  year: string;
};

export type IncomingAppointmentHistory = {
  operacaoId: string;
  loginUsuario: string;
  nomeUsuario: string;
  agendamentoId: number;
  tipoOperacao: string;
  dataOperacao: string;
  dataConfirmacao: string;
  historico: string;
  tentativas: string;
};

export type AppointmentHistory = {
  operationId: string;
  userLogin: string;
  userName: string;
  appointmentId: number;
  operationType: string;
  operationDate: string;
  confirmationDateTime: string;
  history: string;
  attempts: string;
};

export type PeriodReserveExchange = {
  SemanaId?: number;
  AgendamentoId?: number;
  idIntercambiadora?: string;
  tipoUso?: string;
  agendamentoId?: number;
  codigoBanco?: string;
  agencia?: string;
  contaNumero?: string;
  tipoChavePix?: string;
  chavePix?: string;
  codigoVerificacao?: string;
  preferencial?: boolean;
  documentoTitularConta?: string;
  variacao?: string;
  trocaDeTipoUso?: boolean;
};

export type PeriodReserveList = {
  id: number;
  semanaId: number;
  semanaDataInicial: string;
  semanaDataFinal: string;
  tipoSemanaId: number;
  tipoSemanaNome: string;
  grupoTipoSemanaId: number;
  grupoTipoSemanaNome: string;
  uhCondominio?: number;
  capacidade?: number;
};

export type AvailabilityRequest = {
  id: number;
  semanaId: number;
  semanaDataInicial: string;
  semanaDataFinal: string;
  tipoSemanaId: number;
  tipoSemanaNome: string;
  grupoTipoSemanaId: number;
  grupoTipoSemanaNome: string;
  uhCondominio: number;
  capacidade: number;
};

export type AvailabilityType = {
  id: number;
  weekId: number;
  startDate: string;
  endDate: string;
  weekTypeId: number;
  weekTypeName: string;
  weekGroupTypeId: number;
  weekGroupTypeName: string;
  condoUnit: number;
  capacity: number;
};

export type ParamsTypeAvailabilityAdm = {
  Agendamentoid?: number;
  CotaAccessCenterId?: number;
  CotaPortalId?: number;
  Ano?: number;
};

export type TypeIncludeWeekUserDataBody = {
  cotaId: number;
  semanaId: number;
  uhCondominioId: number;
  cotaPortalNome: string;
  cotaPortalCodigo: string;
  grupoCotaPortalNome: string;
  numeroImovel: string;
  cotaProprietarioId: number;
  tipoUtilizacao: string;
  accountId: number | string;
  existAccounntBank: boolean;
  onlyPixKey: boolean;
  bankCode: string;
  agency: string;
  accountNumber: string;
  pixKeyType: string;
  pixKey: string;
  code: string;
  preference: boolean;
  variation: string;
  hasSCPContract: boolean;
  accountHolderName: string;
  accountDocument: string;
};

export type AvailabilityForExchangeQueryParams = {
  Agendamentoid?: number;
  CotaAccessCenterId?: number;
  CotaPortalId?: number;
  UhCondominioId?: number;
  CotaPortalNome?: string;
  CotaPortalCodigo?: string;
  GrupoCotaPortalNome?: string;
  NumeroImovel?: string;
  CotaProprietarioId?: number;
  Ano?: number;
};
