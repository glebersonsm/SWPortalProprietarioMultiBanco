import ModalToShowDetails from "@/components/ModalToShowDetails";
import { TokenizedCard } from "@/utils/types/finance";
import {
  FormControl,
  FormLabel,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import React from "react";

type ShowDetailsModalProps = {
  tokenizedCard: TokenizedCard;
  shouldOpen: boolean;
};

export default function ShowDetailsModal({
  tokenizedCard,
  shouldOpen,
}: ShowDetailsModalProps) {
  return (
    <ModalToShowDetails
      title="Detalhes do cartão tokenizado"
      shouldOpen={shouldOpen}
    >
      <Stack gap={2}>
        <Typography fontWeight="lg" level="title-lg">
          Informações do pessoa
        </Typography>
      <FormControl>
        <FormLabel>ID</FormLabel>
        <Textarea defaultValue={tokenizedCard.id} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>ID da pessoa</FormLabel>
        <Textarea defaultValue={tokenizedCard.personId} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Nome da pessoa</FormLabel>
        <Textarea defaultValue={tokenizedCard.personName} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Data de criação</FormLabel>
        <Textarea defaultValue={tokenizedCard.creationDate} readOnly />
      </FormControl>
      </Stack>
      <Stack gap={2}>
        <Typography fontWeight="lg" level="title-lg">
          Informações do cartão
        </Typography>
        <FormControl>
          <FormLabel>Bandeira</FormLabel>
          <Textarea defaultValue={tokenizedCard.card.brand} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Nome no cartão</FormLabel>
          <Textarea defaultValue={tokenizedCard.cardHolder ?? tokenizedCard.card.card_holder} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Número do cartão</FormLabel>
          <Textarea defaultValue={tokenizedCard.card.card_number} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Data de vencimento</FormLabel>
          <Textarea defaultValue={tokenizedCard.card.due_date} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Adquirente</FormLabel>
          <Textarea defaultValue={tokenizedCard.company.acquirer} readOnly />
        </FormControl>
      </Stack>
    </ModalToShowDetails>
  );
}
