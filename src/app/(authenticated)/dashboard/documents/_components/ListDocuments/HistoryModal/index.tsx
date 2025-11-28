import * as React from "react";

import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import {
  FormControl,
  FormLabel,
  Input,
  ModalOverflow,
  Button,
  Stack,
  Box,
  Typography,
} from "@mui/joy";
import useCloseModal from "@/hooks/useCloseModal";
import HistoryTable from "./HistoryTable";
import { Document } from "@/utils/types/documents";
import DescriptionIcon from "@mui/icons-material/Description";

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
    <Modal
      open={shouldOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          closeModal();
        }
      }}
    >
      <ModalOverflow>
        <ModalDialog
          sx={{
            maxWidth: "900px",
            width: "90%",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #035781 0%, rgba(3, 87, 129, 0.8) 100%)",
              color: "white",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              py: 2,
              px: 3,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <DescriptionIcon />
            Histórico de Acessos ao Documento
          </DialogTitle>
          <DialogContent
            sx={{
              p: 3,
              overflow: "auto",
              flex: 1,
            }}
          >
            <Stack spacing={3}>
              <FormControl>
                <FormLabel
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "text.primary",
                    mb: 1,
                  }}
                >
                  Nome do Documento
                </FormLabel>
                <Input
                  defaultValue={document.name}
                  disabled
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    backgroundColor: "background.level1",
                    "&.Mui-disabled": {
                      color: "text.primary",
                      fontWeight: 500,
                    },
                  }}
                />
              </FormControl>
              <HistoryTable document={document} />
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              onClick={closeModal}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                minWidth: "120px",
              }}
            >
              Fechar
            </Button>
          </DialogActions>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
