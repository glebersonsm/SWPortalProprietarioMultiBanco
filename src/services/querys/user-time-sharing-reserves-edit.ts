import axios from "@/services/AxiosInstance";

// Tipos para o endpoint de editar reserva
export type EditReserveResponse = {
  status: number;
  success: boolean;
  data: Array<{
    idHotel: number;
    id: number;
    nomeHotel: string;
    idReservasFront: number;
    idOrigemReserva: number;
    origemReserva: string;
    statusReserva: string;
    usuario: number;
    nomeUsuario: string;
    clienteReservante: number;
    clienteReservanteNome: string;
    tipoUhEstadia: number;
    nomeTipoUhEstadia: string;
    reservante: string;
    telefoneReservante: string;
    emailReservante: string;
    codUh: string;
    idTarifa: number;
    nomeTarifa: string;
    segmentoReserva: string;
    meioComunicacao: string;
    contratoInicial: number;
    contratoFinal: number;
    dataChegadaPrevista: string;
    dataChegadaReal: string;
    dataPartidaPrevista: string;
    dataPartidaReal: string;
    adultos: number;
    criancas1: number;
    criancas2: number;
    codPensao: string;
    pensao: string;
    dataReserva: string;
    dataConfirmacao: string;
    observacoes: string;
    documento: string;
    numReserva: number;
    dataCancelamento: string;
    obsCancelamento: string;
    dataReativacao: string;
    flgDiariaFixa: string;
    vleDiariaManual: number;
    trgDtInclusao: string;
    trgUserInclusao: string;
    hospedes: Array<{
      id: number;
      idHospede: number;
      tipoHospede: string;
      clienteId: number;
      principal: string;
      nome: string;
      dataNascimento: string;
      documento: string;
      tipoDocumento: string;
      email: string;
      sexo: string;
      telefone: string;
      codigoIbge: string;
      logradouro: string;
      numero: string;
      bairro: string;
      cep: string;
      dataCheckin: string;
      dataCheckout: string;
    }>;
  }>;
  errors: string[];
  message: string;
};

// Tipos para o endpoint de cancelar reserva
export type CancelReserveResponse = {
  status: number;
  success: boolean;
  data: boolean;
  errors: string[];
  message: string;
};

export const getReserveForEdit = async (numReserva: number): Promise<EditReserveResponse> => {
  const response = await axios.get("/TimeSharingUsuario/editarReserva", {
    params: {
      numReserva: numReserva,
    },
  });
  return response.data;
};

export const cancelReserve = async (numReserva: number): Promise<CancelReserveResponse> => {
  const response = await axios.post("/TimeSharingUsuario/cancelar", null, {
    params: {
      numReserva: numReserva,
    },
  });
  return response.data;
};