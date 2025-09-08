import { formatDate } from "@/utils/dates";
import {
  IncomingUserReserveWrittenOff,
  UserReserveWrittenOff,
} from "@/utils/types/user-time-sharing-ReservesWrittenOff";

export function transformedUserReservesWrittenOff(
  reserves: IncomingUserReserveWrittenOff[]
): UserReserveWrittenOff[] {
  return reserves.map((reserve) => {
    return {
      projectXContract: reserve.projetoXContrato,
      contractNumber: reserve.numeroContrato,
      reserveNumber: reserve.numReserva,
      tsSaleId: reserve.idVendaTs,
      waitingList: reserve.listaEspera,
      taxExempt: reserve.taxaIsenta,
      clientName: reserve.nomeCliente,
      hotel: reserve.hotel,
      uhCodeType: reserve.codTipoUh,
      uhType: reserve.tipoUH,
      checkin: reserve.checkin,
      checkout: reserve.checkout,
      reserveStatus: reserve.statusReserva,
      confirmationDate: reserve.dataConfirmacao,
      cancellationDate: reserve.dataCancelamento,
      fractionation: reserve.fracionamento,
      adults: reserve.adultos,
      children1: reserve.criancas1,
      children2: reserve.criancas2,
      reservationPoint: reserve.pontoReserva,
      createdBy: reserve.criadaPor,
      launchType: reserve.tipoLancamento,
      reserveType: reserve.tipoReserva,
      pensionAmount: reserve.valorPensao,
      pointValue: reserve.valorPonto,
      pointsValue: reserve.valorPontos,
      pointsAmount: reserve.pontoReserva,
    };
  });
}
