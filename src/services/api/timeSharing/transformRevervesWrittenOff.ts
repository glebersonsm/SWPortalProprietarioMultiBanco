import { formatDate } from "@/utils/dates";
import { IncomingReserveWrittenOff } from "@/utils/types/timeSharing/reservesWrittenOff";

export function transformedReservesWrittenOff(
  reserves: IncomingReserveWrittenOff[]
) {
  return reserves.map((reserve) => {
    return {
      projectXContract: reserve.projetoXContrato,
      contractNumber: reserve.numeroContrato,
      reserveNumber: reserve.numReserva,
      reserveStatus: reserve.statusReserva,
      tsSaleId: reserve.idVendaTs,
      waitingList: reserve.listaEspera,
      taxExempt: reserve.taxaIsenta,
      clientName: reserve.nomeCliente,
      hotel: reserve.hotel,
      uhCodeType: reserve.codTipoUh,
      uhType: reserve.tipoUH,
      checkin: reserve.checkin,
      checkout: reserve.checkout,
      confirmationDate: formatDate(reserve.dataConfirmacao),
      cancellationDate: formatDate(reserve.dataCancelamento),
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
