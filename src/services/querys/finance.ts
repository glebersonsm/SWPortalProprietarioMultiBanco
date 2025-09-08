import axios from "@/services/AxiosInstance";
import {
  FiltersOutstandingBills,
  FiltersTokenizedCards,
  FiltersTransactions,
  OutstandingBills,
  TokenizedCard,
  Transactions,
} from "@/utils/types/finance";
import {
  transformedOutstandingBills,
  transformedTokenizedCards,
  transformedTransactions,
} from "../api/transformFinance";

export const getOutstandingBills = async ({
  filters,
  page,
  rowsPerPage
}: {
  filters: FiltersOutstandingBills;
  page: number;
  rowsPerPage: number;
}): Promise<OutstandingBills> => {
  try {
    
    const response = await axios.get("/Financeiro/searchContasPendentes", {
      params: {
        VencimentoInicial: filters.initialDueDate,
        VencimentoFinal: filters.finalDueDate,
        PessoaNome: filters.personName,
        EmpresaId: filters.companyId,
        NumeroDaPagina: page,
        QuantidadeRegistrosRetornar: rowsPerPage,
        status: filters.status,
      },
      timeout: 1000000, 
    });

    const data = response.data;
    
    const outstandingBills = transformedOutstandingBills(data.data);
    return {
      outstandingBills,
      lastPageNumber: data.lastPageNumber,
      pageNumber: data.pageNumber,
    };

  } catch (error: any) {
        throw error; // Repropaga o erro para o chamador
  }
};


export const getTokenizedCards = async (
  debounceFilters: FiltersTokenizedCards
): Promise<TokenizedCard[]> => {
  try {
    
    const response = await axios.get("/Financeiro/gettokenizedcards", {
      params: {
        PessoaNome: debounceFilters.personName,
        PessoaId: debounceFilters.personId,
      },
      timeout: 1000000, // Opcional: limite de tempo para evitar travamentos
    });

    const tokenizedCards = response.data.data;

    return transformedTokenizedCards(tokenizedCards);

  } catch (error: any) {
      throw error; // Permite que o componente ou hook que chamou trate o erro
  }
};

export const getTransactions = async ({
  filters,
  page,
  rowsPerPage,
}: {
  filters: FiltersTransactions;
  page: number;
  rowsPerPage: number;
}): Promise<Transactions> => {
  try {

    const response = await axios.get("/Financeiro/searchtransacoes", {
      params: {
        NumeroDaPagina: page,
        QuantidadeRegistrosRetornar: rowsPerPage,
        RetornarContasVinculadas: true,
        PessoaId: filters.personId,
        DataInicial: filters.initialDate,
        DataFinal: filters.finalDate,
        PessoaNome: filters.personName,
        StatusTransacao: filters.paymentStatus,
        Cartao:
          filters.paymentType === "card"
            ? true
            : filters.paymentType === "pix"
            ? false
            : "",
        Pix:
          filters.paymentType === "pix"
            ? true
            : filters.paymentType === "card"
            ? false
            : "",
        EmpresaId: filters.companyId
      },
      timeout: 1000000, // opcional: evita travamentos
    });

    const data = response.data;

    const transactions = transformedTransactions(data.data);

    return {
      transactions,
      lastPageNumber: data.lastPageNumber,
      pageNumber: data.pageNumber,
    };

  } catch (error: any) {
    throw error;
  }
};


export const cancelTransaction = async (paymentId: string) => {
  try {

    const response = await axios.post(
      `/Financeiro/cancelartransacao?paymentId=${paymentId}`,
      null, // corpo nulo, se necessário
      {
        timeout: 1000000, // opcional
      }
    );

    return response.data.data;

  } catch (error: any) {
    throw error;
  }
};

