import { formatDate } from "@/utils/dates";
import {
  IncomingUserReserve,
  UserReserve,
} from "@/utils/types/user-time-sharing-reserves";

export function transformedUserReserves(
  reserves: IncomingUserReserve[]
): UserReserve[] {
  return reserves.map((reserve) => {
    return {
      confidential: reserve.confidencial,
      idFrontReservations: reserve.idReservasFront,
      uhType: reserve.tipoUh,
      reserveNumber: reserve.numReserva,
      reserveDate: formatDate(reserve.dataReserva),
      checkin: reserve.checkin,
      checkout: reserve.checkout,
      hostType: reserve.tipoHospede,
      hostName: reserve.nomeHospede,
      segment: reserve.segmento,
      origin: reserve.origem,
      adults: reserve.adultos,
      children1: reserve.criancas1,
      children2: reserve.criancas2,
      numberContract: reserve.numeroContrato,
      personId: reserve.idPessoa,
      clientName: reserve.nomeCliente,
      hotel: reserve.hotel,
      clientDocument: reserve.numDocumentoCliente,
      clientEmail: reserve.emailCliente,
      cancellationContract: reserve.contratoCancelado,
      reserveStatus: reserve.statusReserva,
      cancellationDate: formatDate(reserve.dataCancelamento),
      observations: reserve.observacoes,
      tariff: reserve.tarifa,
      hotelClient: reserve.clienteHotel,
      reasonSocialClientHotel: reserve.razaoSocialClienteHotel,
    };
  });
}
