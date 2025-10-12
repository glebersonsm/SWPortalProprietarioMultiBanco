"use client";

import InputField from "@/components/InputField";
import useCloseModal from "@/hooks/useCloseModal";
import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  ModalOverflow,
  Stack,
} from "@mui/joy";
import { useRouter } from "next/navigation";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";

type ValidateCertificateModalProps = {
  shouldOpen: boolean;
};

export default function ValidateCertificateModal({
  shouldOpen,
}: ValidateCertificateModalProps) {
  const router = useRouter();
  const closeModal = useCloseModal();

  const form = useForm<{ protocol: string }>({
    defaultValues: {
      protocol: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: { protocol: string }) => {
    router.push(`/certificate/${data.protocol}/validate`);
  };

  return (
    <Modal open={shouldOpen} onClose={closeModal} sx={{ backdropFilter: "blur(3px)", backgroundColor: "rgba(14, 42, 71, 0.25)" }}>
      <ModalOverflow>
        <ModalDialog sx={{
          p: 0,
          background: "var(--modal-bg-gradient)",
          border: "1px solid var(--modal-border-color)",
          boxShadow: "0 12px 28px var(--modal-shadow-color)",
          color: "var(--modal-text-color)",
        }}>
          <DialogTitle   sx={{
          textAlign: "center",
          color: "var(--modal-text-color)",
          backgroundColor: "var(--modal-header-bg)",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
        }} >Validar certidão positiva/negativa</DialogTitle>
          <DialogContent sx={{ marginTop: "10px", marginBottom: "10px", marginLeft: "10px", marginRight: "10px" }}>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={2}>
                  <InputField field="protocol" label="Digite o protocolo" />
                  <Button 
                    variant="solid"
                    sx={{
                      bgcolor: "var(--color-button-primary)",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 500,
                      color: "var(--color-button-text)",
                      "&:hover": {
                        bgcolor: "var(--color-button-primary-hover)",
                      },
                    }}
                   type="submit">Validar</Button>
                </Stack>
              </form>
            </FormProvider>
          </DialogContent>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
