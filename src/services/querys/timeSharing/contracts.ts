import { transformedContracts } from "@/services/api/timeSharing/transformContracts";
import axios from "@/services/AxiosInstance";
import { FiltersProps, Contracts } from "@/utils/types/timeSharing/contracts";

export const getContracts = async ({
  filters,
  page,
  rowsPerPage,
}: {
  filters: FiltersProps;
  page: number;
  rowsPerPage: number;
}): Promise<Contracts> => {
  const response = await axios.get("/TimeSharing/contratosTimeSharing", {
    params: {
      NomeCliente: filters.clientName,
      NumeroContrato: filters.contractNumber,
      NumDocumentoCliente: filters.clientDocument,
      ProjetoXContrato: filters.projectXContract,
      Status: filters.status,
      DataVendaInicial: filters.initialSaleDate,
      DataVendaFinal: filters.finalSaleDate,
      DataCancelamentoInicial: filters.initialCancellationDate,
      DataCancelamentoFinal: filters.finalCancellationDate,
      IdVendaTs: filters.tsSaleId,
      SalaVendas: filters.saleRoom,
      TipoContrato: filters.contractType,
      NumeroDaPagina: page,
      QuantidadeRegistrosRetornar: rowsPerPage
    },
  });
  const data = response.data;

  const contracts = transformedContracts(data.data);

  return {
    contracts: contracts,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};
