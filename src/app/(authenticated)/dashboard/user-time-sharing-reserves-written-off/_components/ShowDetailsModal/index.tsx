import ModalToShowDetails from "@/components/ModalToShowDetails";
import { UserReserveWrittenOff } from "@/utils/types/user-time-sharing-ReservesWrittenOff";
import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { formatDate } from "@/utils/dates";
import React from "react";

type ShowDetailsModalProps = {
  reserve: UserReserveWrittenOff;
  shouldOpen: boolean;
};

export default function ShowDetailsModal({
  reserve,
  shouldOpen,
}: ShowDetailsModalProps) {
  return (
    <ModalToShowDetails
      title="Detalhes da reserva"
      shouldOpen={shouldOpen}
    >
      <FormControl>
        <FormLabel>Número reserva</FormLabel>
        <Textarea defaultValue={reserve.reserveNumber} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Nome do cliente</FormLabel>
        <Textarea defaultValue={reserve.clientName} readOnly />
      </FormControl>
      {/* <FormControl>
        <FormLabel>Lista de espera</FormLabel>
        <Textarea defaultValue={reserve.waitingList} readOnly />
      </FormControl> */}
      <FormControl>
        <FormLabel>Taxa isenta</FormLabel>
        <Textarea defaultValue={reserve.taxExempt} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Tipo de Reserva</FormLabel>
        <Textarea defaultValue={reserve.reserveType} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Hotel</FormLabel>
        <Textarea defaultValue={reserve.hotel} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Códito tipo UH</FormLabel>
        <Textarea defaultValue={reserve.uhCodeType} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Status</FormLabel>
        <Textarea defaultValue={reserve.reserveStatus} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Tipo UH</FormLabel>
        <Textarea defaultValue={reserve.uhType} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Checkin</FormLabel>
        <Textarea defaultValue={formatDate(reserve.checkin)} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Checkout</FormLabel>
        <Textarea defaultValue={formatDate(reserve.checkout)} readOnly />
      </FormControl>
      {/* <FormControl>
        <FormLabel>Data de confirmação</FormLabel>
        <Textarea defaultValue={formatDate(reserve.confirmationDate)} readOnly />
      </FormControl> */}
      <FormControl>
        <FormLabel>Cancelada em</FormLabel>
        <Textarea defaultValue={formatDate(reserve.cancellationDate)} readOnly />
      </FormControl>
      {/* <FormControl>
        <FormLabel>Fracionamento</FormLabel>
        <Textarea defaultValue={reserve.fractionation} readOnly />
      </FormControl> */}
      <FormControl>
        <FormLabel>Adultos/Crianças1/Crianças2</FormLabel>
        <Textarea defaultValue={`${reserve.adults} / ${reserve.children1} / ${reserve.children2}`}  readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Criado por</FormLabel>
        <Textarea defaultValue={reserve.createdBy} readOnly />
      </FormControl>
      {/* <FormControl>
        <FormLabel>Tipo de lançamento</FormLabel>
        <Textarea defaultValue={reserve.launchType} readOnly />
      </FormControl> */}
      <FormControl>
        <FormLabel>Valor da pensão</FormLabel>
        <Textarea defaultValue={reserve.pensionAmount} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Valor de ponto</FormLabel>
        <Textarea defaultValue={reserve.pointValue} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Qtde. pontos utilizados na reserva</FormLabel>
        <Textarea defaultValue={reserve.pointsAmount} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Valor de pontos</FormLabel>
        <Textarea defaultValue={reserve.pointsValue} readOnly />
      </FormControl>
    </ModalToShowDetails>
  );
}
