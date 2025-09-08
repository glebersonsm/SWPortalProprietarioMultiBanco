import { transformedUserReserves } from "@/services/api/userTimeSharing/transformUserReverves";
import axios from "@/services/AxiosInstance";
import {
  UserReserves,
  FiltersProps,
} from "@/utils/types/user-time-sharing-reserves";

// Tipos para o endpoint de salvar reserva
export type SaveReserveRequest = {
  reserva: number;
  numeroContrato: string;
  idVenda: number;
  checkin: string;
  checkout: string;
  quantideAdultos: number;
  quantidadeCrianca1: number;
  quantidadeCrianca2: number;
  hospedes: Array<{
    id: number;
    idHospede: number;
    estrangeiro: number;
    tipoHospede: string;
    clienteId: number;
    principal: string;
    nome: string;
    dataNascimento: string;
    documento: string;
    tipoDocumento: string;
    tipoDocumentoId: number;
    email: string;
    sexo: string;
    DDI: string;
    DDD: string;
    telefone: string;
    codigoIbge: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cep: string;
    cidadeId: number;
    dataCheckin: string;
    dataCheckout: string;
  }>;
};

export type SaveReserveResponse = {
  status: number;
  success: boolean;
  data: any;
  errors: string[];
};

export const getUserReserves = async (
  debounceFilters: FiltersProps,
  page: number,
  rowsPerPage: number = 15
): Promise<UserReserves> => {
  const response = await axios.get("/TimeSharingUsuario/minhasReservas", {
    params: {
      ExibirTodosOsHospedes: debounceFilters.showAllHosts,
      NumReserva: debounceFilters.reserveNumber,
      NumeroContrato: debounceFilters.contractNumber,
      StatusReserva: debounceFilters.reserveStatus,
      CheckinInicial: debounceFilters.initialCheckin,
      CheckinFinal: debounceFilters.finalCheckin,
      CheckoutInicial: debounceFilters.initialCheckout,
      CheckoutFinal: debounceFilters.finalCheckout,
      NumeroDaPagina: page,
      QuantidadeRegistrosRetornar: rowsPerPage,
    },
  });
  const data = response.data;

  const reserves = transformedUserReserves(data.data);

  return {
    reserves: reserves,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};

export const saveTimeShareReserve = async (
  reserveData: SaveReserveRequest
): Promise<SaveReserveResponse> => {
  const response = await axios.post("/TimeSharingUsuario/salvarReserva", reserveData);
  return response.data;
};
