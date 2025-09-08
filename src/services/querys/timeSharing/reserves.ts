import { transformedReserves } from "@/services/api/timeSharing/transformReverves";
import axios from "@/services/AxiosInstance";
import { Reserves, FiltersProps } from "@/utils/types/timeSharing/reserves";

export const getReserves = async ({
  filters,
  page,
}: {
  filters: FiltersProps;
  page: number;
}): Promise<Reserves> => {
  const response = await axios.get("/TimeSharing/searchReservas", {
    params: {
      ExibirTodosOsHospedes: filters.showAllHosts,
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
      QuantidadeRegistrosRetornar: 15,
    },
  });
  const data = response.data;

  const reserves = transformedReserves(data.data);

  return {
    reserves: reserves,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};
