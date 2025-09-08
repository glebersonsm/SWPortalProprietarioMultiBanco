import ModalToShowDetails from "@/components/ModalToShowDetails";
import { Reserve } from "@/utils/types/timeSharing/reserves";
import { FormControl, FormLabel, Textarea, Grid, Typography, Divider, Chip, Box } from "@mui/joy";
import { formatDate } from "@/utils/dates";
import React from "react";

type ShowDetailsModalProps = {
  reserve: Reserve;
  shouldOpen: boolean;
};

const labelSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  color: "primary.plainColor",
};

const sectionTitleSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 800,
  fontSize: "1.1rem",
  color: "primary.500",
  mb: 1,
};

const getStatusColor = (status: string) => {
  const statusLower = status?.toLowerCase();
  if (statusLower?.includes('cancelad')) return 'danger';
  if (statusLower?.includes('confirm')) return 'success';
  if (statusLower?.includes('pendente')) return 'warning';
  return 'neutral';
};

export default function ShowDetailsModal({
  reserve,
  shouldOpen,
}: ShowDetailsModalProps) {
  return (
    <ModalToShowDetails
      title={`Detalhes da Reserva #${reserve.reserveNumber}`}
      shouldOpen={shouldOpen}
    >
      <Grid container spacing={3}>
        {/* Seção: Informações da Reserva */}
        <Grid xs={12}>
          <Typography sx={sectionTitleSx}>📋 Informações da Reserva</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Número da Reserva</FormLabel>
            <Textarea defaultValue={reserve.reserveNumber} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Status</FormLabel>
            <Box sx={{ mt: 0.5 }}>
              <Chip 
                color={getStatusColor(reserve.reserveStatus)} 
                variant="soft"
                size="lg"
              >
                {reserve.reserveStatus}
              </Chip>
            </Box>
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Número do Contrato</FormLabel>
            <Textarea defaultValue={reserve.numberContract} readOnly minRows={1} />
          </FormControl>
        </Grid>

        {/* Seção: Dados do Cliente */}
        <Grid xs={12} sx={{ mt: 2 }}>
          <Typography sx={sectionTitleSx}>👤 Dados do Cliente</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        <Grid xs={12} sm={6}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do Cliente</FormLabel>
            <Textarea defaultValue={reserve.clientName} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>Documento</FormLabel>
            <Textarea defaultValue={reserve.clientDocument} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <FormControl>
            <FormLabel sx={labelSx}>ID da Pessoa</FormLabel>
            <Textarea defaultValue={reserve.personId} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12}>
          <FormControl>
            <FormLabel sx={labelSx}>Email do Cliente</FormLabel>
            <Textarea defaultValue={reserve.clientEmail} readOnly minRows={1} />
          </FormControl>
        </Grid>

        {/* Seção: Informações do Hóspede */}
        <Grid xs={12} sx={{ mt: 2 }}>
          <Typography sx={sectionTitleSx}>🏠 Informações do Hóspede</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        <Grid xs={12} sm={6}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome do Hóspede</FormLabel>
            <Textarea defaultValue={reserve.hostName} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={6}>
          <FormControl>
            <FormLabel sx={labelSx}>Tipo de Hóspede</FormLabel>
            <Textarea defaultValue={reserve.hostType} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Adultos</FormLabel>
            <Textarea defaultValue={reserve.adults} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Crianças (0-5 anos)</FormLabel>
            <Textarea defaultValue={reserve.children1} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Crianças (6-12 anos)</FormLabel>
            <Textarea defaultValue={reserve.children2} readOnly minRows={1} />
          </FormControl>
        </Grid>

        {/* Seção: Informações do Hotel */}
        <Grid xs={12} sx={{ mt: 2 }}>
          <Typography sx={sectionTitleSx}>🏨 Informações do Hotel</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        <Grid xs={12} sm={6}>
          <FormControl>
            <FormLabel sx={labelSx}>Hotel</FormLabel>
            <Textarea defaultValue={reserve.hotel} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={6}>
          <FormControl>
            <FormLabel sx={labelSx}>Tipo de UH</FormLabel>
            <Textarea defaultValue={reserve.uhType} readOnly minRows={1} />
          </FormControl>
        </Grid>

        {/* Seção: Datas */}
        <Grid xs={12} sx={{ mt: 2 }}>
          <Typography sx={sectionTitleSx}>📅 Datas da Estadia</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Check-in</FormLabel>
            <Textarea defaultValue={formatDate(reserve.checkin)} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Check-out</FormLabel>
            <Textarea defaultValue={formatDate(reserve.checkout)} readOnly minRows={1} />
          </FormControl>
        </Grid>
        
        {reserve.cancellationDate && (
          <Grid xs={12} sm={6} md={4}>
            <FormControl>
              <FormLabel sx={labelSx}>Data de Cancelamento</FormLabel>
              <Textarea defaultValue={formatDate(reserve.cancellationDate)} readOnly minRows={1} />
            </FormControl>
          </Grid>
        )}

        {/* Seção: Observações */}
        {reserve.observations && (
          <>
            <Grid xs={12} sx={{ mt: 2 }}>
              <Typography sx={sectionTitleSx}>📝 Observações Gerais</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid xs={12}>
              <FormControl>
                <FormLabel sx={labelSx}>Observações da Reserva</FormLabel>
                <Textarea 
                  defaultValue={reserve.observations} 
                  readOnly 
                  minRows={3}
                  maxRows={6}
                />
              </FormControl>
            </Grid>
          </>
        )}
      </Grid>
    </ModalToShowDetails>
  );
}
