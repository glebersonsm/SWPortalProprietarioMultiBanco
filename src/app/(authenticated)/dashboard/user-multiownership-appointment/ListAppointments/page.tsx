"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetAppointments } from "../hook";
import { useSearchParams } from "next/navigation";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import ListAppointments from "../_components/ListAppointments";
import ReleasePoolModal from "../_components/ReleasePoolModal";
import { match, P } from "ts-pattern";
import { Button, Card, CardContent, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useFilters } from "../Filters.context.hook";
import { useReservar } from "../context.hook";
import { CancelBookingInListModal } from "../_components/CancelBookingInListModal";
import IconOpenModal from "@/components/IconOpenModal";
import { useMutation } from "@tanstack/react-query";
import { downloadContractSCPUser } from "@/services/querys/user-multiownership-contracts";
import DownloadingIcon from "@mui/icons-material/Downloading";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Divider, IconButton, Stack, Tooltip, Chip, Avatar, Grid, Paper, Typography as MuiTypography } from "@mui/material";
import { ModalSchedulingUser } from "../_components/ModalScheduling";
import { Owner } from "@/utils/types/multiownership/owners";
import { Voucher } from "../_components/voucher";

export default function AppointmentsPage() {
  const router = useRouter();
  const { filters, setFilters } = useFilters();
  const { owner } = useReservar();
  const searchParams = useSearchParams();
  
  // Estado para controle do ano selecionado
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data, isLoading } = useGetAppointments();
  const { appointments = [] } = data ?? {};

  const { action, appointmentId } = useMemo(() => {
    const action = searchParams.get("action");
    const appointmentId = searchParams.get("appointmentId");
    const quotaId = searchParams.get("quotaId");

    return {
      action,
      appointmentId,
      quotaId,
    };
  }, [searchParams]);

  // Funções para navegação entre anos
  const handlePreviousYear = () => {
    const newYear = selectedYear - 1;
    setSelectedYear(newYear);
    setFilters(prev => ({ ...prev, year: String(newYear) }));
  };

  const handleCurrentYear = () => {
    setSelectedYear(currentYear);
    setFilters(prev => ({ ...prev, year: String(currentYear) }));
  };

  const handleNextYear = () => {
    const newYear = selectedYear + 1;
    setSelectedYear(newYear);
    setFilters(prev => ({ ...prev, year: String(newYear) }));
  };

  // Sincronizar ano selecionado com filtros na inicialização
  useEffect(() => {
    if (filters.year && filters.year !== String(selectedYear)) {
      setSelectedYear(parseInt(filters.year));
    }
  }, [filters.year, selectedYear]);

  useEffect(() => {
    if (!owner || Object.keys(owner).length === 0) {
      router.push(`/dashboard/user-multiownership-appointment`);
    }
  }, [owner, router]);

  const selectedAppointment = useMemo(
    () =>
      appointments.find(
        (appointment) => appointment.id === Number(appointmentId)
      ),
    [appointments, appointmentId]
  );

  const handleExit = () => {
    router.push(`/dashboard/user-multiownership-appointment`);
  };

  const downloadMutation = useMutation({
    mutationFn: async (quotaId: number) => {
      const response = await downloadContractSCPUser({ cotaId: quotaId });
      return response;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Contrato_${new Date().toISOString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Erro ao baixar contrato", error);
    },
  });

  return (
    <>
      <Box sx={{ ml: { xs: 0, md: 2 }, mr: { xs: 0, md: 1 } }}>
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            p: 0,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.08)'
          }}
        >
          {/* Header do Card */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 36,
              height: 36
            }}
          >
            <PersonIcon fontSize="medium" />
          </Avatar>
          <Box>
            <Typography
              level="title-md"
              fontWeight="bold"
              sx={{ color: 'white', fontSize: '1.125rem' }}
            >
              Informações do Cliente
            </Typography>
            <Typography
              level="body-sm"
              sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}
            >
              Dados pessoais e contratuais
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 2 }}>
           <Grid container spacing={2}>
             {/* Coluna 1: Dados Pessoais */}
             <Grid xs={12} md={4}>
               <Box sx={{ mb: 1 }}>
                 <Typography
                   level="title-sm"
                   sx={{ 
                     color: 'var(--form-label-color, #155a73)', 
                     fontWeight: 'bold', 
                     mb: 1,
                     display: 'flex',
                     alignItems: 'center',
                     gap: 1,
                     fontSize: '0.875rem',
                     marginLeft: 1
                   }}
                 >
                   <BusinessIcon fontSize="small" />
                   Dados Pessoais
                 </Typography>
                 
                 <Stack spacing={1}>
                   <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: 'wrap', ml: 2 }}>
                     <BusinessIcon sx={{ marginLeft: 1, color: 'var(--color-icon-secondary)', fontSize: 16 }} />
                     <Typography fontWeight="md" sx={{ fontSize: '0.75rem', minWidth: 60, color: 'var(--color-text-tertiary)' }}>
                       Empresa:
                     </Typography>
                     <Chip 
                       label={owner.enterpriseName}
                       variant="outlined"
                       size="small"
                       sx={{ 
                         fontWeight: 'bold',
                         borderColor: 'var(--color-button-primary)',
                         color: 'var(--color-button-primary)',
                         fontSize: '0.7rem',
                         height: 24
                       }}
                     />
                   </Box>

                   <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: 'wrap', ml: 2 }}>
                     <PersonIcon sx={{ marginLeft: 1, color: 'var(--color-icon-secondary)', fontSize: 16 }} />
                     <Typography fontWeight="md" sx={{ fontSize: '0.75rem', minWidth: 60, color: 'var(--color-text-tertiary)' }}>
                       Nome:
                     </Typography>
                     <Typography fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                       {owner.clientName}
                     </Typography>
                   </Box>
                 </Stack>
               </Box>
             </Grid>

             {/* Coluna 2: Dados da Propriedade */}
             <Grid xs={12} md={4}>
               <Box sx={{ mb: 1 }}>
                 <Typography
                   level="title-sm"
                   sx={{ 
                     color: 'var(--form-label-color, #155a73)', 
                     fontWeight: 'bold', 
                     mb: 1,
                     display: 'flex',
                     alignItems: 'center',
                     gap: 1,
                     fontSize: '0.875rem'
                   }}
                 >
                   <HomeIcon fontSize="small" />
                   Propriedade
                 </Typography>
                 
                 <Stack spacing={1}>
                   <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: 'wrap' }}>
                     <HomeIcon sx={{ color: 'var(--color-icon-secondary)', fontSize: 16 }} />
                     <Typography fontWeight="md" sx={{ fontSize: '0.75rem', minWidth: 40, color: 'var(--color-text-tertiary)' }}>
                       Cota:
                     </Typography>
                     <Chip 
                       label={owner.fractionName}
                       variant="filled"
                       size="small"
                       sx={{ 
                         bgcolor: 'var(--color-success-bg)',
                         color: 'var(--color-success-dark)',
                         fontWeight: 'bold',
                         fontSize: '0.7rem',
                         height: 24
                       }}
                     />
                   </Box>

                   <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: 'wrap' }}>
                     <ApartmentIcon sx={{ color: 'var(--color-icon-secondary)', fontSize: 16 }} />
                     <Typography fontWeight="md" sx={{ fontSize: '0.75rem', minWidth: 40, color: 'var(--color-text-tertiary)' }}>
                       UH:
                     </Typography>
                     <Chip 
                       label={owner.propertyNumber}
                       variant="outlined"
                       size="small"
                       sx={{ fontWeight: 'bold', fontSize: '0.7rem', height: 24 }}
                     />
                     <Typography fontWeight="md" sx={{ fontSize: '0.75rem', ml: 1, color: 'var(--color-text-tertiary)' }}>
                       Bloco:
                     </Typography>
                     <Chip 
                       label={owner.blockName}
                       variant="outlined"
                       size="small"
                       sx={{ fontWeight: 'bold', fontSize: '0.7rem', height: 24 }}
                     />
                   </Box>
                 </Stack>
               </Box>
             </Grid>

             {/* Coluna 3: Dados Contratuais */}
             <Grid xs={12} md={4}>
               <Box sx={{ mb: 1 }}>
                 <Typography
                   level="title-sm"
                   sx={{ 
                     color: 'var(--form-label-color, #155a73)', 
                     fontWeight: 'bold', 
                     mb: 1,
                     display: 'flex',
                     alignItems: 'center',
                     gap: 1,
                     fontSize: '0.875rem'
                   }}
                 >
                   <DescriptionIcon fontSize="small" />
                   Contrato
                 </Typography>
                 
                 <Stack spacing={1}>
                   <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: 'wrap' }}>
                     <DescriptionIcon sx={{ color: 'var(--color-icon-secondary)', fontSize: 16 }} />
                     <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                       <Chip 
                         label={owner.contractNumber}
                         variant="filled"
                         size="small"
                         sx={{ 
                           bgcolor: 'var(--color-warning-bg)',
                           color: 'var(--color-warning-dark)',
                           fontWeight: 'bold',
                           fontSize: '0.7rem',
                           height: 24
                         }}
                       />
                       <Chip 
                         label={owner.quotaGroupNome}
                         variant="outlined"
                         size="small"
                         sx={{ 
                           borderColor: 'var(--color-warning-main)',
                           color: 'var(--color-warning-main)',
                           fontWeight: 'bold',
                           fontSize: '0.7rem',
                           height: 24
                         }}
                       />
                     </Box>
                   </Box>

                   {owner?.idIntercambiadora && (
                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: 'wrap' }}>
                       <DescriptionIcon sx={{ color: 'var(--color-icon-secondary)', fontSize: 16 }} />
                       <Typography fontWeight="md" sx={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                         RCI:
                       </Typography>
                       <Chip 
                         label={owner.idIntercambiadora}
                         variant="filled"
                         size="small"
                         sx={{ 
                           bgcolor: 'var(--color-info-bg)',
                           color: 'var(--color-info-dark)',
                           fontWeight: 'bold',
                           fontSize: '0.7rem',
                           height: 24
                         }}
                       />
                     </Box>
                   )}
                 </Stack>
               </Box>
             </Grid>
           </Grid>
         </CardContent>

        <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />
        <Box sx={{ 
          display: "flex", 
          gap: 2, 
          p: 2, 
          bgcolor: 'grey.50',
          justifyContent: 'flex-start',
          flexWrap: 'wrap'
        }}>
          <IconOpenModal
            params={{ quotaId: owner.quotaId }}
            type="add"
            buttonText="Novo Agendamento"
            asButton={true}
            showIcon={true}
            showToolTipWhenAsButton={true}
            tooltip="Incluir agendamento"
            sxoverride={{
              backgroundColor: "var(--color-button-primary)",
              color: "var(--color-button-text)",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "var(--color-button-primary-hover)",
                transform: 'translateY(-2px)',
                boxShadow: 4
              },
              transition: 'all 0.2s ease-in-out'
            }}
          />
          {owner.hasSCPContract && (
            <Tooltip title="Baixar contrato">
              <IconButton
                size="large"
                sx={{
                  backgroundColor: "var(--color-success-main)",
                  color: "white",
                  borderRadius: 2,
                  boxShadow: 2,
                  "&:hover": {
                    backgroundColor: "var(--color-success-dark)",
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  },
                  "&:disabled": {
                    backgroundColor: "grey.300",
                    color: "grey.500"
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => downloadMutation.mutate(owner.quotaId)}
                disabled={downloadMutation.isPending}
              >
                <DownloadingIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        </Card>
      </Box>

      <Box sx={{ ml: { xs: 0, md: 2 }, mr: { xs: 0, md: 1 }, mt: 2 }}>
        <Stack spacing={3} divider={<Divider />}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            {/* Navegação de Anos Centralizada */}
             <Stack direction="row" spacing={1} alignItems="center">
               <MuiTypography
                 variant="body2"
                 sx={{
                   color: 'white',
                   fontWeight: 600,
                   fontSize: '1rem'
                 }}
               >
                 Agendamentos de:
               </MuiTypography>
              <Chip
                label={selectedYear - 1}
                variant="outlined"
                size="medium"
                onClick={handlePreviousYear}
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  minWidth: 60,
                  height: 32,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white'
                  }
                }}
              />
              <Chip
                label={selectedYear}
                variant="filled"
                size="medium"
                sx={{
                  fontSize: '0.875rem',
                  minWidth: 60,
                  height: 32,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              />
              <Chip
                label={selectedYear + 1}
                variant="outlined"
                size="medium"
                onClick={handleNextYear}
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  minWidth: 60,
                  height: 32,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white'
                  }
                }}
              />
            </Stack>
           </Box>

        {isLoading ? (
          <LoadingData />
        ) : appointments.length === 0 ? (
          <WithoutData />
        ) : (
          <Stack spacing={2}>
            <Box sx={{ ml: { xs: 0, md: 2 }, mr: { xs: 0, md: 1 } }}>
              <ListAppointments appointments={appointments} />
            </Box>
            <Box
              display={"flex"}
              gap={2}
              justifyContent={"space-between"}
              alignSelf="flex-end"
              marginTop="8px"
            >
              <Button
                variant="outlined"
                color="danger"
                onClick={handleExit}
                sx={{
                  width: {
                    xs: "100%",
                    md: "200px",
                  },
                }}
              >
                Sair
              </Button>
            </Box>
          </Stack>
        )}
        </Stack>
      </Box>

      {match({ action, selectedAppointment })
        .with(
          { action: "reset", selectedAppointment: P.not(undefined) },
          ({ selectedAppointment }) => (
            <ReleasePoolModal
              coteId={selectedAppointment.coteId}
              appointment={selectedAppointment}
              periodCoteAvailabilityId={
                selectedAppointment.periodCoteAvailabilityId
              }
              roomCondominiumId={selectedAppointment.roomCondominiumId}
              hasSCPContract={selectedAppointment.hasSCPContract}
              shouldOpen={true}
              appointmentId={selectedAppointment.id}
            />
          )
        )
        .with(
          { action: "delete", selectedAppointment: P.not(undefined) },
          ({ selectedAppointment }) => (
            <CancelBookingInListModal
              shouldOpen={true}
              booking={selectedAppointment?.bookings}
              appointmentId={selectedAppointment.id}
            />
          )
        )
        .with(
          { action: "baixar", selectedAppointment: P.not(undefined) },
          ({ selectedAppointment }) => (
            <Voucher shouldOpen={true} appointmentId={selectedAppointment.id} />
          )
        )
        .otherwise(() => null)}

      {match({ action, owner })
        .with({ action: "add", owner: P.not(undefined) }, ({ owner }) => (
          <ModalSchedulingUser shouldOpen={true} owner={owner as Owner} />
        ))
        .otherwise(() => null)}
    </>
  );
}
