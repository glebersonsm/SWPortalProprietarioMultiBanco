import ModalToShowDetails from "@/components/ModalToShowDetails";
import { Reserve } from "@/utils/types/timeSharing/reserves";
import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { formatDate } from "@/utils/dates";
import React from "react";

type ShowDetailsModalProps = {
  reserve: Reserve;
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
        <FormLabel>Reserva</FormLabel>
        <Textarea defaultValue={reserve.reserveNumber} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Nome do cliente</FormLabel>
        <Textarea defaultValue={reserve.clientName} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Documento do cliente</FormLabel>
        <Textarea defaultValue={reserve.clientDocument} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Email do cliente</FormLabel>
        <Textarea defaultValue={reserve.clientEmail} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Número do contrato</FormLabel>
        <Textarea defaultValue={reserve.numberContract} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Tipo UH</FormLabel>
        <Textarea defaultValue={reserve.uhType} readOnly />
      </FormControl>
      {/* <FormControl>
        <FormLabel>Data de reserva</FormLabel>
        <Textarea defaultValue={formatDate(reserve.reserveDate)} readOnly />
      </FormControl> */}
      <FormControl>
        <FormLabel>Tipo de hóspede</FormLabel>
        <Textarea defaultValue={reserve.hostType} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Nome do hóspede</FormLabel>
        <Textarea defaultValue={reserve.hostName} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Hotel</FormLabel>
        <Textarea defaultValue={reserve.hotel} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Checkin</FormLabel>
        <Textarea defaultValue={formatDate(reserve.checkin)} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Checkout</FormLabel>
        <Textarea defaultValue={formatDate(reserve.checkout)} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Adultos/Crianças1/Crianças2</FormLabel>
        <Textarea defaultValue={`${reserve.adults} / ${reserve.children1} / ${reserve.children2}`}  readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Status</FormLabel>
        <Textarea defaultValue={reserve.reserveStatus} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Observações</FormLabel>
        <Textarea defaultValue={reserve.observations} readOnly />
      </FormControl>
    </ModalToShowDetails>
  );
}
