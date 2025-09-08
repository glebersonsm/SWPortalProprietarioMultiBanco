import axios from "@/services/AxiosInstance";

export type AvailabilityParams = {
  NumeroContrato: string;
  IdVenda: string;
  HotelId: string;
  DataInicial: Date;
  DataFinal: Date;
  TipoDeBusca: string;
};

export type AvailabilityItem = {
  tipoApartamento: string;
  capacidade: number;
  qtdePaxInformada: number;
  diarias: number;
  nomeHotel: string;
  checkin: string;
  checkout: string;
  saldoPontos: number;
  pontosIntegralDisp: number;
  pontosNecessario: number;
  numeroContrato: string;
  padraoTarifario: string;
  idVenda?: number; // Campo opcional para quando é passado para o BookingForm
};

export type AvailabilityResponse = {
  status: number;
  success: boolean;
  data: AvailabilityItem[];
  errors: string[];
};

export const getAvailability = async (params: AvailabilityParams): Promise<AvailabilityResponse> => {
  const response = await axios.get("/TimeSharingUsuario/disponibilidade", {
    params: {
      NumeroContrato: params.NumeroContrato,
      IdVenda: params.IdVenda,
      HotelId: params.HotelId,
      DataInicial: params.DataInicial,
      DataFinal: params.DataFinal,
      TipoDeBusca: params.TipoDeBusca,
    },
  });
  
  return response.data;
};