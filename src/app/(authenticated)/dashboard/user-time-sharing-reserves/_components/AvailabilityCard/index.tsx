"use client";
import React from "react";
import { Card, CardContent, Typography, Stack, Box, Button, Chip, Divider } from "@mui/joy";
import { AvailabilityItem } from "@/services/querys/user-time-sharing-availability";
import { formatDate } from "@/utils/dates";
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';

type AvailabilityCardProps = {
  availability: AvailabilityItem;
  onSelect?: (availability: AvailabilityItem) => void;
};

export default function AvailabilityCard({ availability, onSelect }: AvailabilityCardProps) {
  const startDate = formatDate(availability.checkin);
  const endDate = formatDate(availability.checkout);

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        width: "100%", 
        mb: 3,
        borderRadius: 'lg',
        boxShadow: 'sm',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 'md',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* Header com nome do hotel */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HotelIcon sx={{ color: 'primary.500', fontSize: '20px' }} />
            <Typography level="title-lg" sx={{ fontWeight: 600, color: 'primary.700' }}>
              {availability.nomeHotel}
            </Typography>
          </Box>

          {/* Informações principais em grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
            gap: 2,
            p: 2,
            bgcolor: 'neutral.50',
            borderRadius: 'md'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* <StarIcon sx={{ color: 'warning.500', fontSize: '18px' }} /> */}
              <Box>
                <Typography level="body-xs" sx={{ color: 'neutral.600', mb: 0.5 }}>
                  Tipo de Apartamento
                </Typography>
                <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                  {availability.tipoApartamento}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ color: 'success.500', fontSize: '18px' }} />
              <Box>
                <Typography level="body-xs" sx={{ color: 'neutral.600', mb: 0.5 }}>
                  Capacidade Máxima
                </Typography>
                <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                  {availability.capacidade ?? 2} pessoas
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Período */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            p: 2,
            bgcolor: 'primary.50',
            borderRadius: 'md',
            border: '1px solid',
            borderColor: 'primary.200'
          }}>
            <CalendarTodayIcon sx={{ color: 'primary.600', fontSize: '18px' }} />
            <Box sx={{ flex: 1 }}>
              <Typography level="body-xs" sx={{ color: 'primary.700', mb: 0.5 }}>
                Período da Reserva
              </Typography>
              <Typography level="title-sm" sx={{ fontWeight: 600, color: 'primary.800' }}>
                {startDate} até {endDate}
              </Typography>
              <Chip 
                size="sm" 
                variant="soft" 
                color="primary"
                sx={{ mt: 0.5, fontSize: '11px' }}
              >
                {availability.diarias} diárias
              </Chip>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Informações de pontos */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography level="title-sm" sx={{ color: 'neutral.700', fontWeight: 600 }}>
              Informações de Pontos
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: 'success.50', 
                borderRadius: 'sm',
                border: '1px solid',
                borderColor: 'success.200'
              }}>
                <Typography level="body-xs" sx={{ color: 'success.700', mb: 0.5 }}>
                  Pontos do contrato
                </Typography>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: 'success.800' }}>
                  {availability.saldoPontos} / {availability.pontosIntegralDisp}
                </Typography>
                <Typography level="body-xs" sx={{ color: 'success.600' }}>
                  Total / Integralizados
                </Typography>
              </Box>

              <Box sx={{ 
                p: 1.5, 
                bgcolor: 'warning.50', 
                borderRadius: 'sm',
                border: '1px solid',
                borderColor: 'warning.200'
              }}>
                <Typography level="body-xs" sx={{ color: 'warning.700', mb: 0.5 }}>
                  Pontos Necessários
                </Typography>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: 'warning.800' }}>
                  {availability.padraoTarifario}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Botão de seleção */}
          <Box sx={{ pt: 1 }}>
            <Button 
              variant="solid" 
              color="primary" 
              size="lg"
              fullWidth
              sx={{
                borderRadius: 'md',
                fontWeight: 600,
                py: 1.5,
                fontSize: '14px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 'md'
                }
              }}
              onClick={() => onSelect && onSelect(availability)}
            >
              Selecionar este período
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}