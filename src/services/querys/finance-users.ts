import axios from "@/services/AxiosInstance";
import {
  transformedOutstandingBills,
  transformedTokenizedCards,
} from "../api/transformFinance";
import {
  AddTokenizedCardData,
  Certificate,
  FiltersUserOutstandingBills,
  PropsToGenerateQRCode,
  PropsToPayByCard,
  UserOutstandingBills,
  UserTokenizedCard,
  SavedCard,
  SaveCardRequest,
  BandeiraAceita,
  PayWithSavedCardRequestBody,
  PayWithNewCardRequestBody,
} from "@/utils/types/finance-users";
import { toast } from "react-toastify";
import { format } from "date-fns";

export const getUserOutstandingBills = async (
  debounceFilters: FiltersUserOutstandingBills,
  page: number,
  rowsPerPage: number,
): Promise<UserOutstandingBills> => {
  try {
    const response = await axios.get(
      "/FinanceiroUsuario/searchContasPedentesDoUsuarioLogado",
      {
        params: {
          VencimentoInicial: debounceFilters.initialDueDate,
          VencimentoFinal: debounceFilters.finalDueDate,
          EmpresaId: debounceFilters.companyId,
          Status: debounceFilters.status,
          NumeroDaPagina: page,
          QuantidadeRegistrosRetornar: rowsPerPage ?? 15,
        },
        timeout: 100000, // opcional: evita travamento indefinido
      }
    );

    const data = response.data;

    const outstandingBills = transformedOutstandingBills(data.data);

    return {
      outstandingBills,
      lastPageNumber: data.lastPageNumber,
      pageNumber: data.pageNumber,
    };

  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro desconhecido ao buscar contas pendentes do usuário.";

    throw new Error(message);
  }
};


export const generateQRCode = async (data: PropsToGenerateQRCode) => {
  try {
    const response = await axios.post(
      "/FinanceiroUsuario/gerarQrCodePagamentoComPixItau",
      {
        pessoaId: data.personId,
        valorTotal: data.totalValue,
        itensToPay: data.ids,
        idEmpresa: data.idEmpresa,
        idTorre: data.idTorre,
        idContrato: data.idContrato,
        contas: data.contasFinanceiras
      },
      {
        timeout: 100000, // opcional
      }
    );

    const qrCode = response.data.data;

    return qrCode;

  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro desconhecido ao gerar QR Code.";

    throw new Error(message);
  }
};

export const consultarStatusPix = async (txid: string) => {
  try {
    const response = await axios.get(`/FinanceiroUsuario/consultarStatusPagamentoPix/${txid}`);
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro ao consultar status do pagamento PIX.";
    
    throw new Error(message);
  }
};

export const confirmarPagamentoPix = async (txid: string) => {
  try {
    const response = await axios.post("/FinanceiroUsuario/confirmarPagamentoPix", { txid });
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro ao confirmar pagamento PIX.";
    
    throw new Error(message);
  }
};

/**
 * ⚠️ APENAS PARA DESENVOLVIMENTO ⚠️
 * Simula o pagamento de um PIX para testes
 */
export const simularPagamentoPix = async (txid: string) => {
  try {
    const response = await axios.post(`/FinanceiroUsuario/simularPagamentoPix/${txid}`);
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.errors?.[0] ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro ao simular pagamento PIX";
    
    throw new Error(message);
  }
};


export const getUserTokenizedCards = async (): Promise<UserTokenizedCard[]> => {
  const response = await axios.get("/FinanceiroUsuario/getmytokenizedcards");
  const data = response.data.data;

  return transformedTokenizedCards(data);
};

export const deleteUserTokenizedCard = async (tokenizedCardId: number) => {
  try {

    const response = await axios.post("/FinanceiroUsuario/deletemycard", {
      tokenizedCard: tokenizedCardId,
    }, {
      timeout: 100000, // opcional
    });

    return response.data.data;

  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro desconhecido ao tentar excluir o cartão.";

    throw new Error(message);
  }
};


export const addTokenizedCard = async (data: AddTokenizedCardData) => {
  try {

    const response = await axios.post("/FinanceiroUsuario/tokenizemycard", {
      card: {
        card_number: data.number,
        cvv: data.cvv,
        due_date: data.expiry,
        card_holder: data.name,
      },
    }, {
      timeout: 100000, // opcional
    });

    return response.data.data;

  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro desconhecido ao tentar tokenizar o cartão.";

    throw new Error(message);
  }
};


export const payByCreditCard = async (data: PropsToPayByCard) => {
  try {

    const response = await axios.post(
      "/FinanceiroUsuario/transacionarcomcartao",
      {
        pessoaId: data.personId,
        valorTotal: data.totalValue,
        itensToPay: data.ids,
        cardTokenizedId: data.tokenizedCardId,
      },
      {
        timeout: 100000, // opcional: evita travamento indefinido
      }
    );

    return response.data.data;

  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro desconhecido ao tentar processar o pagamento.";


    throw new Error(message);
  }
};


export const downloadCertificates = async (date: string) => {
  try {
    const response = await axios.post(
      `/FinanceiroUsuario/certidaofinanceira`,
      {
        data: date,
      },
      {
        responseType: "arraybuffer",
      }
    );
    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], {
      type: "application/zip",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const currentDate = format(new Date(), "ddMMyyyy");

    const fileName = `certidao_${currentDate}.zip`;
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  } catch (error) {
    toast.error("Erro ao baixar arquivo!");
  }
};

export const validateCertificate = async (
  protocol: string
): Promise<Certificate | { message: string; error: true }> => {
  try {
    const response = await axios.get(
      `/FinanceiroUsuario/validarprotocolo/${protocol}`
    );
    const data = response.data.data;

    return {
      competence: data.competencia,
      issueAt: data.certidaoEmitidaEm,
      quota: data.cota,
      documentName: data.nomeDocumento,
      documentNumber: data.cpfCnpj,
      protocol: data.protocolo,
      numberTowerOrBLock: data.torreBlocoNumero,
      propertyName: data.multiproprietario,
      propertyNumber: data.imovelNumero,
    } satisfies Certificate;
  } catch (e: any) {
    if (e.response.status == 404) {
      return {
        message: "Certidão inválida",
        error: true,
      };
    }
    return {
      message: "Não é possível validar a certidão nesse momento",
      error: true,
    };
  }
};

export const downloadBill = async (
  typeableBillLine: string,
  financeId: number
) => {
  try {
    const response = await axios.get(`/FinanceiroUsuario/downloadBoleto`, {
      responseType: "arraybuffer",
      params: {
        IdContaFinanceira: financeId,
        LinhaDigitavelBoleto: typeableBillLine,
      },
    });
    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], {
      type: contentType,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const currentDate = format(new Date(), "ddMMyyyy");
    const fileName = `boleto_${financeId}_${currentDate}.pdf`;
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  } catch (error) {
    toast.error("Erro ao baixar arquivo!");
  }
};

export const getSavedCards = async (params?: { idEmpresa?: number; idTorre?: number | null; idContrato?: number | null; }): Promise<SavedCard[]> => {
  try {
    // Limpar parâmetros null/undefined para evitar enviar na query string
    const cleanParams: any = {};
    if (params) {
      if (params.idEmpresa !== undefined && params.idEmpresa !== null) {
        cleanParams.idEmpresa = params.idEmpresa;
      }
      if (params.idTorre !== undefined && params.idTorre !== null) {
        cleanParams.idTorre = params.idTorre;
      }
      if (params.idContrato !== undefined && params.idContrato !== null) {
        cleanParams.idContrato = params.idContrato;
      }
    }

    const requestConfig = Object.keys(cleanParams).length > 0 
      ? { params: cleanParams }
      : {};
    
    const response = await axios.get(`/CartaoSalvo/meus-cartoes`, requestConfig);
    
    // Tentar diferentes formatos de resposta
    let cards: SavedCard[] = [];
    
    // Formato 1: response.data é um array direto
    if (Array.isArray(response.data)) {
      cards = response.data;
    }
    // Formato 2: response.data.data é um array
    else if (Array.isArray(response.data?.data)) {
      cards = response.data.data;
    }
    // Formato 3: response.data.items ou response.data.cards
    else if (Array.isArray(response.data?.items)) {
      cards = response.data.items;
    }
    else if (Array.isArray(response.data?.cards)) {
      cards = response.data.cards;
    }
    // Formato 4: response.data.result
    else if (Array.isArray(response.data?.result)) {
      cards = response.data.result;
    }
    
    return cards;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      "Erro ao buscar cartões salvos.";
    
    throw new Error(message);
  }
};

export const saveCard = async (payload: SaveCardRequest): Promise<SavedCard> => {
  try {
    const response = await axios.post(`/CartaoSalvo/salvar`, payload);
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro ao salvar cartão.";
    throw new Error(message);
  }
};

export const payWithSavedCard = async (
  payload: PayWithSavedCardRequestBody
): Promise<any> => {
  try {
    const response = await axios.post(
      "/api/v1/pagamento/processar-pagamento-cartao-salvo",
      payload
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro ao processar pagamento.";
    throw new Error(message);
  }
};

export const payWithNewCard = async (
  payload: PayWithNewCardRequestBody
): Promise<any> => {
  try {
    const response = await axios.post(
      "/api/v1/pagamento/processar-pagamento-cartao-novo",
      payload
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro ao processar pagamento.";
    throw new Error(message);
  }
};

export const getBandeirasAceitas = async (): Promise<BandeiraAceita[]> => {
  try {
    const response = await axios.get(`/CartaoSalvo/bandeiras-aceitas`);
    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Erro ao buscar bandeiras aceitas.";
    throw new Error(message);
  }
};
