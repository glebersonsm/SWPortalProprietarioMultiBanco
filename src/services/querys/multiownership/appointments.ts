import {
  transformedBookings,
  transformedEditBookings,
  transformedMultiOwnershipAppointments,
  translateAvailability,
} from "@/services/api/multiownership/transformedMultiOwnershipAppointments";
import axios from "@/services/AxiosInstance";
import {
  AppointmentBooking,
  AppointmentEditBooking,
  AppointmentInventory,
  AppointmentsMultiOwnership,
  FiltersProps,
  IncomingAppointmentInventory,
  IncomingAppointmentHistory,
  AppointmentHistory,
  ParamsTypeAvailabilityAdm
} from "@/utils/types/multiownership/appointments";

import { formatDate } from "@/utils/dates";

export const getAppointmentsMultiOwnership = async ({
  filters,
  page,
  rowsPerPage,
}: {
  filters: FiltersProps;
  page: number;
  rowsPerPage: number;
}): Promise<AppointmentsMultiOwnership> => {
  const response = await axios.get(
    "/MultiPropriedade/consultarAgendamentosGerais",
    {
      params: {
        Reserva: filters.reserveNumber,
        PeriodoCotaDisponibilidadeId: filters.periodCoteAvailabilityId,
        Ano: filters.year,
        NomeProprietario: filters.clientName,
        DocumentoProprietario: filters.clientDocument,
        ComReservas: filters.onlyWithReservation,
        NumeroApartamento: filters.roomNumber,
        DataUtilizacaoInicial: filters.intialDate,
        DataUtilizacaoFinal: filters.finalDate,
        DataInicial: filters.intialDate,
        DataFinal: filters.finalDate,
        NomeCota: filters.ownershipCoteName,
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

export const getAppointmentHistory = async (
  appointmentId: number
): Promise<AppointmentHistory[] | undefined> => {
  const response = await axios.get(`/Multipropriedade/agendamento/history/${appointmentId}`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  const data = response.data.data;

  const appointmentHistory = data.map((item: IncomingAppointmentHistory) => {
    return {
      operationId: item.operacaoId,
      userName: item.nomeUsuario,
      userLogin: item.loginUsuario,
      appointmentId: item.agendamentoId,
      operationType: item.tipoOperacao,
      operationDate: formatDate(item.dataOperacao),
      confirmationDateTime: formatDate(item.dataConfirmacao),
      history: item.historico,
      attempts: item.tentativas,
    };
  });

  return appointmentHistory;
};

export const getAppointmentShowBookings = async (
  appointment: string
): Promise<AppointmentBooking[] | undefined> => {
  const response = await axios.get(
    "/MultiPropriedade/consultarReservasAgendamento",
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

export const cancelBooking = async ({
  bookingId,
  appointmentId,
}: {
  bookingId: string | number;
  appointmentId: string | number;
}) => {
  const response = await axios.post(
    "/MultiPropriedade/cancelarReservaAgendamento",
    {
      reservaId: bookingId,
      agendamentoId: appointmentId,
    }
  );
  return response.data.data;
};

export const releasePoolWeak = async ({
  inventoryId,
  appointmentId,
}: {
  inventoryId: string | number;
  appointmentId: string | number;
}) => {
  const response = await axios.post(
    "/MultiPropriedade/v1/agendamento/liberarSemanaPool",
    {
      inventarioId: inventoryId,
      agendamentoId: appointmentId,
    }
  );
  return response.data.data;
};

export const removePoolWeak = async ({
  inventoryId,
  appointmentId,
}: {
  inventoryId: string | number;
  appointmentId: string | number;
}) => {
  const response = await axios.post(
    "/MultiPropriedade/v1/agendamento/retirarSemanaPool",
    {
      inventarioId: inventoryId,
      agendamentoId: appointmentId,
    }
  );
  return response.data.data;
};

export const getAppointmentInventories = async ({
  appointmentId,
  isPool,
}: {
  appointmentId: string | number;
  isPool?: boolean;
}): Promise<AppointmentInventory[] | undefined> => {
  const { data } = await axios.get(
    "/MultiPropriedade/v1/agendamento/inventarios",
    {
      params: {
        Agendamentoid: appointmentId,
        NoPool: isPool ? "S" : "N",
      },
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );

  const inventories: AppointmentInventory[] = data.data.map(
    (inventory: IncomingAppointmentInventory) => {
      return {
        id: inventory.id,
        inventoryId: inventory.inventarioId,
        code: inventory.codigo,
        name: inventory.nome,
        displayName: inventory.nomeExibicao,
        pool: inventory.pool,
      };
    }
  );

  return inventories;
};

export const fetchAvailabilityAdm = async (params: ParamsTypeAvailabilityAdm) => {
  const response = await axios.get(
    `/MultiPropriedade/v1/disponibilidadeparatroca`, {
    params
  });

  return translateAvailability(response.data.data);
};

export const IncludeWeekAdm = async (data: { cotaId: number, semanaId: number }) =>
  await axios.post("/MultiPropriedade/v1/incluirsemana", data);


export const SwhiftweekAdm = async (data: {agendamentoid: number, semanaId: number}) => {
  const response = await axios.post("/MultiPropriedade/v1/trocarminhasemana", data);
  return response.data.data;
};

export const getAppointmentBookingByIdAdm = async (
  bookingId: string
): Promise<AppointmentEditBooking | undefined> => {
  const response = await axios.get(
    "/MultiPropriedade/editarReserva",
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