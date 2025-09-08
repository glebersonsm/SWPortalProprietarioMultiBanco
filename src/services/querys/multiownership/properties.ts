import axios from "@/services/AxiosInstance";
import { FiltersProps, Properties } from "@/utils/types/multiownership/properties";
import { transformedProperties } from "../../api/multiownership/transformProperties";

export const getProperties = async (
  debounceFilters: FiltersProps,
  page: number,
  rowsPerPage: number
): Promise<Properties> => {
  const response = await axios.get("/MultiPropriedade/searchImovel", {
    params: {
      NumeroImovel: debounceFilters.propertyNumber,
      CodigoBloco: debounceFilters.blockCode,
      NumeroDaPagina: page,
      QuantidadeRegistrosRetornar: rowsPerPage,
    },
  });
  const data = response.data;

  const properties = transformedProperties(data.data);

  return {
    properties: properties,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};
