import { transformedReservesWrittenOff } from "@/services/api/timeSharing/transformRevervesWrittenOff";
import axios from "@/services/AxiosInstance";
import {
  ReservesWrittenOff,
  FiltersProps,
} from "@/utils/types/timeSharing/reservesWrittenOff";

export const getReservesWrittenOff = async ({
  filters,
  page,
  rowsPerPage,
}: {
  filters: FiltersProps;
  page: number;
  rowsPerPage: number;
}): Promise<ReservesWrittenOff> => {
  const response = await axios.get(
    "/TimeSharing/searchReservasComPontosBaixados",
    {
      params: {
        NumReserva: filters.reserveNumber,
        NumeroContrato: filters.contractNumber,
        NomeCliente: filters.clientName,
        Hotel: filters.hotel,
        NumDocumentoCliente: filters.clientDocument,
        StatusReserva: filters.reserveStatus,
        CheckinInicial: filters.initialCheckin,
        CheckinFinal: filters.finalCheckin,
        CheckoutInicial: filters.initialCheckout,
        CheckoutFinal: filters.finalCheckout,
        NumeroDaPagina: page,
        QuantidadeRegistrosRetornar: rowsPerPage ?? 15,
      },
    }
  );
  const data = response.data;

  const reserves = transformedReservesWrittenOff(data.data);

  return {
    reservesWrittenOff: reserves,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};
