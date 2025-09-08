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
    <Modal open={shouldOpen} onClose={closeModal}>
      <ModalOverflow>
        <ModalDialog>
          <DialogTitle   sx={{
          textAlign: "center",
          color: "primary.solidHoverBg",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
        }} >Validar certidão positiva/negativa</DialogTitle>
          <DialogContent sx={{ marginTop: "10px", marginBottom: "10px", marginLeft: "10px", marginRight: "10px" }}>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={2}>
                  <InputField field="protocol" label="Digite o protocolo" />
                  <Button sx={{
                      bgcolor: "#2ca2cc",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "#035781",
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
