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
} from "@mui/joy";
import useCloseModal from "@/hooks/useCloseModal";
import HistoryTable from "./HistoryTable";
import { Document } from "@/utils/types/documents";
import { Stack } from "@mui/material";

type HistoryModalProps = {
  document: Document;
  shouldOpen: boolean;
};

export default function HistoryModal({
  document,
  shouldOpen,
}: HistoryModalProps) {
  const closeModal = useCloseModal();

  return (
    <>
      <Modal open={shouldOpen}
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
                Histórico de acessos
              </DialogTitle>

              <FormControl sx={{ px: 3, pb: 2 }}>
                <FormLabel sx={{ color: "var(--form-label-color)" }}>Nome do documento</FormLabel>
                <Input defaultValue={document.name} disabled />
                <HistoryTable document={document} />
              </FormControl>

              <Stack direction="row" justifyContent="flex-end" sx={{ px: 3, pb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={closeModal}
                  sx={{
                    minWidth: { xs: "100%", sm: "120px" },
                    height: 44,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    fontFamily: "Montserrat, sans-serif",
                    color: 'var(--color-button-exit-text)',
                    borderColor: 'var(--color-button-exit-border)',
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      backgroundColor: 'var(--color-button-exit-hover-bg)',
                      color: 'var(--color-button-exit-hover-text)',
                      borderColor: 'var(--color-button-exit-hover-border)',
                    },
                  }}
                >
                  Sair
                </Button>
              </Stack>
            </ModalDialog>
          </ModalOverflow>
      </Modal>
    </>
  );
}
