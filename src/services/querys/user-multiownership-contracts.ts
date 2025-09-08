import axios from "@/services/AxiosInstance";
import {
  GetInfoContractsData,
  Owners,
  paramsgetInfoContracts,
  ReservaVoucherDados,
} from "@/utils/types/multiownership/owners";
import { transformedOwners } from "../api/multiownership/transformOwners";

export const getOwners = async (
  page: number,
  rowsPerPage: number
): Promise<Owners> => {
  const response = await axios.get("/MultiPropriedadeUsuario/meusContratos", {
    params: {
      NumeroDaPagina: page,
      QuantidadeRegistrosRetornar: rowsPerPage,
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

export const getInfoContracts = async (
  params: paramsgetInfoContracts
): Promise<GetInfoContractsData[]> => {
  const response = await axios.get(
    "/HtmlTemplate/GetKeyValueListFromContratoSCP",
    { params }
  );
  return response.data.data;
};

export const downloadContractSCPUser = async (params: {
  cotaId: number;
}): Promise<any> => {
  const response = await axios.get(
    "/MultiPropriedadeUsuario/downloadContratoSCP",
    { params, responseType: "blob" }
  );
  return response.data;
};

export const getDadosVoucher = async (params: {
  agendamentoId: number | string;
}): Promise<ReservaVoucherDados> => {
  const response = await axios.get("/MultiPropriedadeUsuario/getDadosVoucher", {
    params,
  });
  return response.data.data;
};
