import {
  AppointmentEditBooking,
  AvailabilityRequest,
  AvailabilityType,
  IncomingAppointmentBooking,
  IncomingAppointmentEditBooking,
  IncomingAppointmentMultiOwnership,
  IncomingApppointmentAccountBank,
} from "@/utils/types/multiownership/appointments";

export function transformedEditBookings(booking: IncomingAppointmentBooking) {
  const guests = booking?.hospedes?.map((guest) => {
    return {
      id: guest.id,
      clientId: guest.clienteId,
      main: guest.principal === "S",
      name: guest.nome,
      cpf: guest.cpf,
      birthday: guest.dataNascimento,
      email: guest.email,
      sex: guest.sexo,
      street: guest.logradouro,
      number: guest.numero,
      neighborhood: guest.bairro,
      complement: guest.complemento,
      cityName: guest.cidadeNome,
      cityId: guest.cidadeId,
      cityFormatted: guest?.cidadeFormatada,
      uf: guest.uf,
      cep: guest.cep,
      countryName: guest.paisNome,
    };
  });

  return {
    id: booking.id,
    reserveDate: booking.dataReserva,
    checkin: booking.checkin,
    checkout: booking.checkout,
    weekType: booking.tipoSemana,
    status: booking.status,
    pensionType: booking.tipoPensao,
    pricingType: booking.tipoTarifacao,
    hostType: booking.tipoHospede,
    uhNameType: booking.tipoUhNome,
    adults: booking.adultos,
    usageType: booking.tipoUso,
    children1: booking.criancas1,
    children2: booking.criancas2,
    hotelNome: booking.hotelNome,
    hostName: booking.nomeHospede,
    periodCoteAvailabilityId: booking.periodoCotaDisponibilidadeId,
    cote: booking.cota,
    ownerName: booking.proprietarioNome,
    ownerCpfCnpj: booking.proprietarioCpfCnpj,
    ownerId: booking.proprietarioId,
    uhCondominiumId: booking.uhCondominioId,
    tipoUtilizacao: booking.tipoUtilizacao,
    capacidade: booking.capacidade,
    guests,
  };
}

export function transformedBookings(bookings?: IncomingAppointmentBooking[]) {
  return bookings?.map((booking) => {
    return {
      ...bookings,
      tipoHospede: booking.tipoHospede,
      id: booking.id,
      reserveDate: booking.dataReserva,
      pricingType: booking.tipoTarifacao,
      checkin: booking.checkin,
      checkout: booking.checkout,
      weekType: booking.tipoSemana,
      status: booking.status,
      pensionType: booking.tipoPensao,
      hostType: booking.tipoHospede,
      uhNameType: booking.tipoUhNome,
      adults: booking.adultos,
      children1: booking.criancas1,
      children2: booking.criancas2,
      hotelNome: booking.hotelNome,
      usageType: booking.tipoUso,
      hostName: booking.nomeHospede,
      periodCoteAvailabilityId: booking.periodoCotaDisponibilidadeId,
      cote: booking.cota,
      ownerName: booking.proprietarioNome,
      ownerCpfCnpj: booking.proprietarioCpfCnpj,
      ownerId: booking.proprietarioId,
      uhCondominiumId: booking.uhCondominioId,
      tipoUtilizacao: booking.tipoUtilizacao,
      capacidade: booking.capacidade,
    };
  });
}

export function transformedMultiOwnershipAppointments(
  appointments: IncomingAppointmentMultiOwnership[]
) {
  return appointments.map((appointment) => {
    const bookings = transformedBookings(appointment.reservas);

    return {
      id: appointment.id,
      periodCoteAvailabilityId: appointment.periodoCotaDisponibilidadeId,
      initialDate: appointment.dataInicial,
      finalDate: appointment.dataFinal,
      weekType: appointment.tipoSemana,
      coteName: appointment.cotaNome,
      coteId: appointment.cotaId,
      roomNumber: appointment.uhCondominioNumero,
      roomCondominiumId: appointment.uhCondominioId,
      ownershipName: appointment.nomeProprietario,
      documentOwnership: appointment.documentoProprietario,
      availableTypeName: appointment.tipoDisponibilizacaoNome,
      reservations: appointment.reservasVinculadas,
      year: appointment.ano,
      mainGuestName: appointment.hospedePrincipal,
      canReleasePool: appointment.podeLiberarParaPool,
      canRemovePool: appointment.podeRetirarDoPool,
      canForceUpdate: appointment.podeForcarAlteracao,
      bookings,
      capacity: appointment.capacidade,
      hasSCPContract: appointment.possuiContratoSCP,
      idIntercambiadora: appointment.idIntercambiadora,
      tipoPessoa: appointment.tipoPessoa,
      temIntercambiadora: appointment.temIntercambiadora,
      pessoaTitular1Tipo: appointment.pessoaTitular1Tipo,
      pessoaTitular1CPF: appointment.pessoaTitular1CPF,
      pessoaTitualar1CNPJ: appointment.pessoaTitualar1CNPJ,
      tipoUtilizacao: appointment.tipoUtilizacao,
      tipoDisponibilizacao: appointment.tipoDisponibilizacao
    };
  });
}

export function transformedAppointmentAccountBank(
  accounts?: IncomingApppointmentAccountBank[]
) {
  return accounts?.map((account) => {
    return {
      id: account.id,
      name: account.nomeNormalizado,
    };
  });
}

export function untransformedEditBookings(
  booking: AppointmentEditBooking
): IncomingAppointmentEditBooking {
  const guests = booking?.guests?.map((guest) => {
    return {
      id: guest.id,
      clienteId: guest.clientId,
      principal: guest.main ? "S" : "N",
      nome: guest.name,
      cpf: guest.cpf,
      dataNascimento: guest.birthday,
      email: guest.email,
      sexo: guest.sex,
      logradouro: guest.street,
      numero: guest.number,
      bairro: guest.neighborhood,
      complemento: guest.complement,
      cidadeNome: guest.cityName,
      cidadeId: guest.cityId,
      uf: guest.uf,
      cep: guest.cep,
      paisNome: guest.countryName,
    };
  });

  return {
    id: booking.id,
    checkin: booking.checkin,
    checkout: booking.checkout,
    tipoSemana: booking.weekType,
    status: booking.status,
    tipoUso: booking.usageType,
    quantidadeAdultos: booking.adults,
    quantidadeCrianca1: booking.children1,
    quantidadeCrianca2: booking.children2,
    tipoUtilizacao: booking.tipoUtilizacao,
    hospedes: guests,
  };
}

export const translateAvailability = (
  data: AvailabilityRequest[]
): AvailabilityType[] => {
  return data.map((item) => ({
    id: item.id,
    weekId: item.semanaId,
    startDate: item.semanaDataInicial,
    endDate: item.semanaDataFinal,
    weekTypeId: item.tipoSemanaId,
    weekTypeName: item.tipoSemanaNome,
    weekGroupTypeId: item.grupoTipoSemanaId,
    weekGroupTypeName: item.grupoTipoSemanaNome,
    condoUnit: item.uhCondominio,
    capacity: item.capacidade,
  }));
};
