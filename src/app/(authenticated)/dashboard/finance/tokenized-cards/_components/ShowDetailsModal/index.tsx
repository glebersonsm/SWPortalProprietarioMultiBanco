import ModalToShowDetails from "@/components/ModalToShowDetails";
import { TokenizedCard } from "@/utils/types/finance";
import {
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Textarea,
  Typography,
} from "@mui/joy";
import React from "react";

type ShowDetailsModalProps = {
  tokenizedCard: TokenizedCard;
  shouldOpen: boolean;
};

const labelSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  color: "primary.plainColor",
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
      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>ID</FormLabel>
            <Textarea defaultValue={tokenizedCard.id} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>ID da pessoa</FormLabel>
            <Textarea defaultValue={tokenizedCard.personId} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome da pessoa</FormLabel>
            <Textarea defaultValue={tokenizedCard.personName} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Data de criação</FormLabel>
            <Textarea defaultValue={tokenizedCard.creationDate} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <Divider />
        </Grid>
        <Grid xs={12}>
          <Typography fontWeight="lg" level="title-lg">
            Informações do cartão
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Divider />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Bandeira</FormLabel>
            <Textarea defaultValue={tokenizedCard.card.brand} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome no cartão</FormLabel>
            <Textarea defaultValue={tokenizedCard.card.card_holder} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Número do cartão</FormLabel>
            <Textarea defaultValue={tokenizedCard.card.card_number} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Data de vencimento</FormLabel>
            <Textarea defaultValue={tokenizedCard.card.due_date} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Adquirente</FormLabel>
            <Textarea defaultValue={tokenizedCard.company.acquirer} readOnly />
          </FormControl>
        </Grid>
      </Grid>
    </ModalToShowDetails>
  );
}