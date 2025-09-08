import axios from "@/services/AxiosInstance";
import { Emails, FiltersProps } from "@/utils/types/emails";
import { transformedEmails } from "../api/transfromEmails";

export const getEmails = async (
  debounceFilters: FiltersProps,
  page: number,
  rowsPerPage: number
): Promise<Emails> => {
  const response = await axios.get("/Email/search", {
    params: {
      Id: debounceFilters.id,
      DataHoraCriacaoInicial: debounceFilters.initialCreationDate,
      DataHoraCriacaoFinal: debounceFilters.finalCreationDate,
      DataHoraEnvioInicial: debounceFilters.initialShippingDate,
      DataHoraEnvioFinal: debounceFilters.finalShippingDate,
      Enviado:
        debounceFilters.sent == "sent"
          ? 1
          : debounceFilters.sent == "notSent"
          ? 0
          : "",
      Destinatario: debounceFilters.recipient,
      Assunto: debounceFilters.subject,
      NumeroDaPagina: page,
      QuantidadeRegistrosRetornar: rowsPerPage,
    },
  });

  const data = response.data;
  const emails = transformedEmails(data.data);

  return {
    emails: emails,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};

export const sendEmail = async (emailId: number) => {
  const response = await axios.post(`/Email/send?id=${emailId}`);
  return response.data.data;
};

