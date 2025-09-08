import axios from "@/services/AxiosInstance";
import { FiltersProps, Owners } from "@/utils/types/multiownership/owners";
import { transformedOwners } from "../../api/multiownership/transformOwners";

export const getOwners = async (
  debounceFilters: FiltersProps,
  page: number,
  rowsPerPage: number
): Promise<Owners> => {
  const response = await axios.get("/MultiPropriedade/searchProprietario", {
    params: {
      Nome: debounceFilters.clientName,
      NumeroUnidade: debounceFilters.unitNumber,
      FracaoCota: debounceFilters.quotaFraction,
      NumeroContrato: debounceFilters.contractNumber,
      DocumentoCliente: debounceFilters.clientDocument,
      DataAquisicaoInicial: debounceFilters.purchaseDateInitial,
      DataAquisicaoFinal: debounceFilters.purchaseDateFinal,
      NumeroDaPagina: page,
      QuantidadeRegistrosRetornar: rowsPerPage,
      EmpresaId: debounceFilters.companyId,
      StatusAssinaturaContratoSCP: debounceFilters.contractSigned
    },
  });
  const data = response.data;

  const owners = transformedOwners(data.data);

  return {
    owners: owners,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};

export const downloadContractSCPAdm = async (params: {
  cotaId: number;
}): Promise<any> => {
  const response = await axios.get("/MultiPropriedade/downloadContratoSCP", {
    params,
    responseType: "blob",
  });
  return response.data;
};
