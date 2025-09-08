import { transformedUserReservesWrittenOff } from "@/services/api/userTimeSharing/transformUserRevervesWrittenOff";
import axios from "@/services/AxiosInstance";
import {
  UserReservesWrittenOff,
  FiltersProps,
} from "@/utils/types/user-time-sharing-ReservesWrittenOff";

export const getUserReservesWrittenOff = async (
  debounceFilters: FiltersProps,
  page: number
): Promise<UserReservesWrittenOff> => {
  const response = await axios.get(
    "/TimeSharingUsuario/minhasReservasComPontosBaixados",
    {
      params: {
        NumReserva: debounceFilters.reserveNumber,
        NumeroContrato: debounceFilters.contractNumber,
        StatusReserva: debounceFilters.reserveStatus,
        CheckinInicial: debounceFilters.initialCheckin,
        CheckinFinal: debounceFilters.finalCheckin,
        CheckoutInicial: debounceFilters.initialCheckout,
        CheckoutFinal: debounceFilters.finalCheckout,
        NumeroDaPagina: page,
        QuantidadeRegistrosRetornar: 15,
      },
    }
  );
  const data = response.data;

  const reserves = transformedUserReservesWrittenOff(data.data);

  return {
    reservesWrittenOff: reserves,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};
