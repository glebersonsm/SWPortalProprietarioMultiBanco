"use client";
import React from "react";
import ModalToShowDetails from "@/components/ModalToShowDetails";
import { AvailabilityItem } from "@/services/querys/user-time-sharing-availability";
import useCloseModal from "@/hooks/useCloseModal";
import { FormControl, FormLabel, Textarea, Grid, Button, Stack, Typography, Box } from "@mui/joy";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type SelectPeriodModalProps = {
  availability: AvailabilityItem | null;
  shouldOpen: boolean;
  onConfirm?: (availability: AvailabilityItem) => void;
  onClose: () => void;
};

const labelSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  color: "primary.plainColor",
};

export default function SelectPeriodModal({
  availability,
  shouldOpen,
  onConfirm,
  onClose,
}: SelectPeriodModalProps) {
  const closeModal = useCloseModal();
  if (!availability) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const startDate = formatDate(availability.checkin);
  const endDate = formatDate(availability.checkout);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(availability);
    }
    onClose();
  };

  return (
    <ModalToShowDetails title="Confirmar Seleção de Período" shouldOpen={shouldOpen}>
      <Stack spacing={3}>
        <Box>
          <Typography level="h4" sx={{ mb: 2, color: "primary.solidBg" }}>
            Detalhes do Período Selecionado
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={labelSx}>Hotel</FormLabel>
              <Textarea defaultValue={availability.nomeHotel} readOnly minRows={2} />
            </FormControl>
          </Grid>
          
          <Grid xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={labelSx}>Tipo de Apartamento</FormLabel>
              <Textarea defaultValue={availability.tipoApartamento} readOnly minRows={2} />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={labelSx}>Data Inicial</FormLabel>
              <Textarea defaultValue={startDate} readOnly minRows={2} />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={labelSx}>Data Final</FormLabel>
              <Textarea defaultValue={endDate} readOnly minRows={2} />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={labelSx}>Pontos Necessários</FormLabel>
              <Textarea defaultValue={availability.pontosNecessario.toString()} readOnly minRows={2} />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={labelSx}>Número do Contrato</FormLabel>
              <Textarea defaultValue={availability.numeroContrato} readOnly minRows={2} />
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="outlined"
            color="neutral"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button 
            variant="solid" 
            color="primary" 
            size="lg"
            onClick={handleConfirm}
            sx={{ minWidth: 200 }}
          >
            Confirmar Reserva
          </Button>
        </Box>
      </Stack>
    </ModalToShowDetails>
  );
}