import IconOpenModal from "@/components/IconOpenModal";
import { formatDate } from "@/utils/dates";
import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  Textarea,
  Typography,
  Button,
  Tooltip
} from "@mui/joy";
import { Paper } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { match, P } from "ts-pattern";
import CancelBookingModal from "../CancelBookingModal";
import { AppointmentBooking } from "@/utils/types/multiownership/appointments";

type ShowAppointmentPageProps = {
  bookings: AppointmentBooking[];
  appointmentId: string | number;
};

export default function ShowBookingsPage({
  bookings,
  appointmentId,
}: ShowAppointmentPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { action, bookingId, from } = useMemo(() => {
    const action = searchParams.get("action");
    const bookingId = searchParams.get("bookingId");
    const from = searchParams.get("from");

    return {
      action,
      bookingId,
      from,
    };
  }, [searchParams]);

  const selectedBooking = useMemo(
    () => bookings?.find((booking) => booking.id === Number(bookingId)),
    [bookings, bookingId]
  );

  if (bookings.length < 1) {
    const returnPath = from === "admin" 
      ? `/dashboard/user-multiownership-appointment/ListAppointmentsAdmView`
      : `/dashboard/multiownership/appointments`;
    router.push(returnPath);
  }

  const bookingStatus = bookings[0].status;
  const existsBookingUpdatable = new Date(bookings[0].checkin) > new Date() || (bookingStatus === "AC" || bookingStatus === "CF" || bookingStatus === "NS");

  const handleExit = () => {
    const returnPath = from === "admin" 
      ? `/dashboard/user-multiownership-appointment/ListAppointmentsAdmView`
      : `/dashboard/multiownership/appointments`;
    router.push(returnPath);
  };

  return (
    <Box sx={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: { xs: 2, md: 3 },
      backgroundColor: '#f8fafc'
    }}>
      {bookings?.map((booking) => (
        <Paper
          key={booking.id}
          elevation={0}
          sx={{ 
            padding: { xs: 3, md: 4 }, 
            marginBottom: 4,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
            '&:hover': {
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          {/* Botão X no canto superior direito */}
          <Button
            variant="plain"
            color="neutral"
            onClick={handleExit}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              minWidth: '32px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              padding: 0,
              color: '#64748b',
              backgroundColor: 'transparent',
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                color: '#374151',
                transform: 'scale(1.1)'
              },
              '&:active': {
                transform: 'scale(0.95)'
              }
            }}
          >
            ×
          </Button>
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <Stack
                flexDirection={{ xs: "column", md: "row" }}
                justifyContent={"space-between"}
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={2}
                sx={{ mb: 3, pb: 2, borderBottom: '2px solid #e2e8f0' }}
              >
                <Box>
                  <Typography 
                    level="h3" 
                    sx={{ 
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontWeight: 700,
                      color: '#1e293b',
                      mb: 0.5
                    }}
                  >
                    Reserva #{booking.id}
                  </Typography>
                  <Typography 
                    level="body-sm" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}
                  >
                    Agendamento {booking.periodCoteAvailabilityId}
                  </Typography>
                </Box>
                {existsBookingUpdatable && (
                  <IconOpenModal
                    params={{ bookingId: booking.id }}
                    type="delete"
                    tooltip="Cancelar reserva"
                    asButton={true}
                    showIcon={true}
                    buttonText="Cancelar reserva"
                    sxoverride={{
                      minWidth: { xs: '100%', sm: '140px' },
                      height: '40px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      borderRadius: '8px',
                      border: '1px solid #dc2626',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#b91c1c',
                        borderColor: '#b91c1c',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      },
                      '&:active': {
                        transform: 'translateY(1px)'
                      }
                    }}
                  />
                )}
              </Stack>
            </Grid>

            {/* Seção de Informações Principais */}
            <Grid xs={12}>
              <Typography 
                level="title-md" 
                sx={{ 
                  mb: 2, 
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                📋 Informações da Reserva
              </Typography>
            </Grid>
            <Grid xs={12} sm={6} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>ID da Reserva</FormLabel>
                <Textarea 
                  defaultValue={booking.id} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>Check-in</FormLabel>
                <Textarea 
                  defaultValue={formatDate(booking.checkin)} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>Check-out</FormLabel>
                <Textarea
                  defaultValue={formatDate(booking.checkout)}
                  readOnly
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>Data da Reserva</FormLabel>
                <Textarea
                  defaultValue={formatDate(booking.reserveDate)}
                  readOnly
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>Status</FormLabel>
                <Textarea 
                  defaultValue={booking.status} 
                  readOnly 
                  sx={{
                    backgroundColor: booking.status === 'AC' ? '#dcfce7' : 'rgba(42, 42, 42, 0.08)',
                    border: `1px solid ${booking.status === 'AC' ? '#bbf7d0' : '#e2e8f0'}`,
                    borderRadius: 2,
                    color: booking.status === 'AC' ? '#166534' : 'inherit',
                    fontWeight: booking.status === 'AC' ? 600 : 'normal',
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>Tipo de Pensão</FormLabel>
                <Textarea 
                  defaultValue={booking.pensionType} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            {/* Seção de Detalhes da Hospedagem */}
            <Grid xs={12} sx={{ mt: 3 }}>
              <Typography 
                level="title-md" 
                sx={{ 
                  mb: 2, 
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                🏨 Detalhes da Hospedagem
              </Typography>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>Tipo de Hóspede</FormLabel>
                <Textarea 
                  defaultValue={booking.hostType} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>Tipo de Unidade</FormLabel>
                <Textarea 
                  defaultValue={booking.uhNameType} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>👥 Adultos</FormLabel>
                <Textarea 
                  defaultValue={booking.adults} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #bfdbfe',
                    borderRadius: 2,
                    textAlign: 'center',
                    fontWeight: 600,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>👶 Crianças 1</FormLabel>
                <Textarea 
                  defaultValue={booking.children1} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #fde68a',
                    borderRadius: 2,
                    textAlign: 'center',
                    fontWeight: 600,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>🧒 Crianças 2</FormLabel>
                <Textarea 
                  defaultValue={booking.children2} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #fde68a',
                    borderRadius: 2,
                    textAlign: 'center',
                    fontWeight: 600,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>🏨 Nome do Hotel</FormLabel>
                <Textarea 
                  defaultValue={booking.hotelNome} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #bae6fd',
                    borderRadius: 2,
                    fontWeight: 500,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            {/* Seção de Informações do Cliente */}
            <Grid xs={12} sx={{ mt: 3 }}>
              <Typography 
                level="title-md" 
                sx={{ 
                  mb: 2, 
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                👤 Informações do Cliente
              </Typography>
            </Grid>
            <Grid xs={12} sm={6} md={5}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>👤 Nome do Hóspede</FormLabel>
                <Textarea 
                  defaultValue={booking.hostName} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #bbf7d0',
                    borderRadius: 2,
                    fontWeight: 500,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={5}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>🏢 Proprietário</FormLabel>
                <Textarea 
                  defaultValue={booking.ownerName} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #e9d5ff',
                    borderRadius: 2,
                    fontWeight: 500,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={2}>
              <FormControl sx={{ '& .MuiFormLabel-root': { fontWeight: 500, color: '#374151', mb: 1 } }}>
                <FormLabel>🆔 ID Cliente</FormLabel>
                <Textarea 
                  defaultValue={booking.ownerId} 
                  readOnly 
                  sx={{
                    backgroundColor: 'rgba(42, 42, 42, 0.08)',
                    border: '1px solid #cbd5e1',
                    borderRadius: 2,
                    textAlign: 'center',
                    fontWeight: 600,
                    '&:focus-within': { borderColor: '#3b82f6' }
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      ))}
      
      {/* Botão Sair no final da página */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4, 
        mb: 2 
      }}>
        <Button 
          variant="outlined" 
          color="neutral" 
          onClick={handleExit} 
          sx={{
            minWidth: '200px',
            height: '48px',
            borderColor: '#cbd5e1',
            color: '#475569',
            backgroundColor: '#ffffff',
            fontWeight: 500,
            borderRadius: '12px',
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: '#94a3b8',
              backgroundColor: '#f8fafc',
              boxShadow: '0 6px 12px -2px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-2px)'
            },
            '&:active': {
              transform: 'translateY(0px)'
            }
          }}
        >
          ← Voltar
        </Button>
      </Box>
      
      {match({ action, selectedBooking })
        .with(
          { action: "delete", selectedBooking: P.not(undefined) },
          ({ selectedBooking }) => (
            <CancelBookingModal
              shouldOpen={true}
              booking={selectedBooking}
              appointmentId={appointmentId}
            />
          )
        )
        .otherwise(() => null)}
    </Box>
  );
}
