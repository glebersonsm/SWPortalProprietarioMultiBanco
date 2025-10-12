import * as React from "react";

import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import {
  FormControl,
  FormLabel,
  Input,
  ModalOverflow,
  Button,
  Box,
} from "@mui/joy";
import useCloseModal from "@/hooks/useCloseModal";
import { Stack } from "@mui/material";
import { AppointmentHistory } from "@/utils/types/multiownership/appointments";
import AppointmentHistoryTable from "./AppointmentHistoryTable";

type AppointmentHistoryModalProps = {
  appointmentId: number;
  appointmentsHistory?: AppointmentHistory[];
  shouldOpen: boolean;
};

export default function AppointmentHistoryModal({
  appointmentId,
  appointmentsHistory,
  shouldOpen,
}: AppointmentHistoryModalProps) {
  const closeModal = useCloseModal();

  return (
    <Modal
      open={shouldOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          closeModal();
        }
      }}
      sx={{ backdropFilter: "blur(3px)", backgroundColor: "rgba(14, 42, 71, 0.25)" }}
    >
      <ModalOverflow>
        <ModalDialog
          sx={{
            width: { xs: "95vw", sm: "90vw", md: "85vw", lg: "80vw" },
            maxWidth: "1200px",
            height: { xs: "90vh", sm: "85vh", md: "80vh" },
            maxHeight: "800px",
            display: "flex",
            flexDirection: "column",
            p: 0,
            background: "var(--modal-bg-gradient)",
            border: "1px solid var(--modal-border-color)",
            boxShadow: "0 12px 28px var(--modal-shadow-color)",
            color: "var(--modal-text-color)",
          }}
        >
          <DialogTitle sx={{ p: 3, pb: 2, color: "var(--modal-text-color)", backgroundColor: "var(--modal-header-bg)" }}>
            Históricos do agendamento
          </DialogTitle>
          
          <Stack spacing={2} sx={{ px: 3, pb: 2, flexShrink: 0 }}>
            <FormControl size="sm">
              <FormLabel>ID do Agendamento</FormLabel>
              <Input 
                value={appointmentId} 
                disabled 
                sx={{ maxWidth: "200px" }}
              />
            </FormControl>
          </Stack>
          
          <Box sx={{ flex: 1, px: 3, pb: 2, overflow: "hidden" }}>
            <AppointmentHistoryTable 
              appointmentId={appointmentId} 
              appointment={appointmentsHistory ?? []} 
            />
          </Box>
          
          <Stack 
            direction="row" 
            justifyContent="flex-end" 
            sx={{ p: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
          >
            <Button
              variant="solid"
              onClick={closeModal}
              sx={{ minWidth: "120px", bgcolor: "var(--color-button-primary)", color: "var(--color-button-text)", "&:hover": { bgcolor: "var(--color-button-primary-hover)" } }}
            >
              Fechar
            </Button>
          </Stack>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}