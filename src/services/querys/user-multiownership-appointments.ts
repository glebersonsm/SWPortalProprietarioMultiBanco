import {
  transformedAppointmentAccountBank,
  transformedBookings,
  transformedEditBookings,
  transformedMultiOwnershipAppointments,
} from "@/services/api/multiownership/transformedMultiOwnershipAppointments";
import axios from "@/services/AxiosInstance";
import {
  AppointmentBooking,
  AppointmentEditBooking,
  IncomingAppointmentEditBooking,
  PeriodReserveList,
  PeriodReserveExchange,
  AvailabilityForExchangeQueryParams,
  TypeIncludeWeekUserDataBody,
} from "@/utils/types/multiownership/appointments";
import {
  UserAppointmentsMultiOwnership,
  FiltersProps,
  UserApppointmentAccountBank,
} from "@/utils/types/user-reservesMultiOwnership";

type EditBookingProps = {
  booking: IncomingAppointmentEditBooking;
  appointmentId: string;
};

type ReleaseMyWeakForPoolProps = {
  appointmentId: string | number;
  accountId?: string | number;
  bankCode?: string;
  agency?: string;
  agencyDigit?: string;
  accountNumber?: string;
  accountDigit?: string;
  pixKeyType?: string;
  pixKey?: string;
  code?: string;
  preference?: boolean;
  accountDocument?: string;
  variation?: string;
};

export const getUserAppointmentsMultiOwnership = async ({
  filters,
  page,
  rowsPerPage,
  cotaAcId,
}: {
  filters: FiltersProps;
  page?: number;
  cotaAcId?: number;
  rowsPerPage?: number;
}): Promise<UserAppointmentsMultiOwnership> => {
  const response = await axios.get(
    "/MultiPropriedadeUsuario/meusAgendamentos",
    {
      params: {
        Ano: filters.year,
        SomentePendenteDeReservas: filters.withoutReservation ? "S" : "N",
        cotaAcId: cotaAcId,
        NumeroDaPagina: page,
        QuantidadeRegistrosRetornar: rowsPerPage,
      },
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
  const data = response.data;
  const appointments = transformedMultiOwnershipAppointments(data.data);

  return {
    appointments,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};

export const getUserAppointmentById = async (
  appointmentId: string,
  cotaAcId?: number,
  ano?: number
): Promise<any | undefined> => {
  
  const params = {
    Ano: ano || new Date().getFullYear(),
    SomentePendenteDeReservas: "N",
    NumeroDaPagina: 1,
    QuantidadeRegistrosRetornar: 1000,
    AgendamentoId: appointmentId,
    ...(cotaAcId && { cotaAcId: cotaAcId }),
  };
  
 
  const response = await axios.get(
    "/MultiPropriedadeUsuario/meusAgendamentos",
    {
      params,
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
  
 
  const data = response.data;
  const appointments = transformedMultiOwnershipAppointments(data.data);
  
  const foundAppointment = appointments.find((apt: any) => apt.id.toString() === appointmentId);
  
  return foundAppointment;
};

export const getUserAppointmentShowBookings = async (
  appointment: string
): Promise<AppointmentBooking[] | undefined> => {
  const response = await axios.get(
    "/MultiPropriedadeUsuario/consultarMinhasReservasAgendamento",
    {
      params: {
        agendamento: appointment,
      },
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
  const data = response.data;

  return transformedBookings(data.data);
};

export const getAppointmentBookingById = async (
  bookingId: string
): Promise<AppointmentEditBooking | undefined> => {
  const response = await axios.get(
    "/MultiPropriedadeUsuario/editarMinhaReserva",
    {
      params: {
        reservaId: bookingId,
      },
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
  const data = response.data;

  return transformedEditBookings(data.data);
};

export const getAccountsBank = async (): Promise<
  UserApppointmentAccountBank[] | undefined
> => {
  const response = await axios.get(
    "/MultiPropriedadeUsuario/minhasContasBancarias"
  );
  const data = response.data;

  return transformedAppointmentAccountBank(data.data);
};

export const cancelUserBooking = async ({
  bookingId,
  appointmentId,
}: {
  bookingId: string | number;
  appointmentId: string | number;
}) => {
  const response = await axios.post(
    "/MultiPropriedadeUsuario/cancelarMinhaReservaAgendamento",
    {
      reservaId: bookingId,
      agendamentoId: appointmentId,
    }
  );
  return response.data.data;
};

export const sendConfirmationCode = async ({
  appointmentId,
}: {
  appointmentId: string | number;
}) => {
  const response = await axios.post(
    "/MultiPropriedadeUsuario/enviarCodigoVerificacao",
    {
      agendamentoId: appointmentId,
    }
  );
  return response.data;
};

export const editBooking = async ({
  booking,
  appointmentId,
}: EditBookingProps) => {
  const response = await axios.post(
    "/MultiPropriedadeUsuario/efetuarOuAlterarReservaAgendamento",
    {
      ...booking,
      agendamentoId: appointmentId,
    }
  );
  return response.data.data;
};

export const releaseMyWeakForPool = async (data: ReleaseMyWeakForPoolProps) => {
  const response = await axios.post(
    "/MultiPropriedadeUsuario/v1/liberarMinhaSemanaParaPool",
    {
      agendamentoId: data.appointmentId,
      codigoBanco: data.bankCode,
      clienteContaBancariaId: data.accountId,
      agencia: data.agency,
      agenciaDigito: data.agencyDigit,
      contaNumero: data.accountNumber,
      contaDigito: data.accountDigit,
      tipoChavePix: data.pixKeyType ?? "F",
      chavePix: data.pixKey,
      codigoVerificacao: data.code,
      preferencial: data.preference,
      documentoTitularConta: data.accountDocument,
      variacao: data.variation ?? "Corrente",
      tipoUso: "Pool"
    }
  );
  return response.data.data;
};



export const AvailabilityForExchange = async (params: AvailabilityForExchangeQueryParams): Promise<PeriodReserveList[]> => {
  const response = await axios.get(
  "/MultiPropriedadeUsuario/v1/disponibilidadeparatroca", { params }
   );
  return response.data.data;
}

export const ForExchange = async (data: PeriodReserveExchange) => {
  const response = await axios.post(
    "/MultiPropriedadeUsuario/v1/trocarminhasemana", { ...data }
  );
  return response.data.data;
}

export const ForUsageTypeExchange = async (data: PeriodReserveExchange) => {
  const response = await axios.post(
    "/MultiPropriedadeUsuario/v1/trocartipouso", { ...data }
  );
  return response.data.data;
}


export const IncludeWeekUser = async (data: TypeIncludeWeekUserDataBody) =>
  await axios.post("/MultiPropriedadeUsuario/v1/incluirsemana", data);


