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
      >

          <ModalOverflow>
          <Stack spacing={3} alignSelf={"center"} paddingTop={"10%"} alignItems="center" maxWidth="50%">
             <ModalDialog>
              <DialogTitle sx={{ color: "var(--color-secondary)" }}>Histórico de acessos</DialogTitle>
              <FormControl>
                <FormLabel>Nome do documento</FormLabel>
                <Input defaultValue={document.name} disabled />
                <HistoryTable document={document} />
              </FormControl>
              <Button
                variant="outlined"
                color="danger"
                onClick={closeModal}
                sx={{ marginTop: 2, maxWidth: "200px" }}
              >
                Sair
              </Button>
            </ModalDialog>
            </Stack>
          </ModalOverflow>
      </Modal>
    </>
  );
}
