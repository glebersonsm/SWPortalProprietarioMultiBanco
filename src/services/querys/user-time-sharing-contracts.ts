import { transformedUserContracts } from "@/services/api/userTimeSharing/transformUserContracts";
import axios from "@/services/AxiosInstance";

import {
  UserContracts,
  FiltersProps,
} from "@/utils/types/user-time-sharing-contracts";

export const getUserContracts = async (
  debounceFilters: FiltersProps,
  page: number,
  rowsPerPage: number = 15
): Promise<UserContracts> => {
  const response = await axios.get("/TimeSharingUsuario/meusContratos", {
    params: {
      NumeroContrato: debounceFilters.contractNumber,
      NumeroDaPagina: page,
      QuantidadeRegistrosRetornar: rowsPerPage,
    },
  });
  const data = response.data;

  const contracts = transformedUserContracts(data.data);

  return {
    contracts: contracts,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};
