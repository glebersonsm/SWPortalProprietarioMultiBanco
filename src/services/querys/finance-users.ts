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
      "/FinanceiroUsuario/gerarQrCodePagamentoComPix",
      {
        pessoaId: data.personId,
        valorTotal: data.totalValue,
        itensToPay: data.ids,
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
