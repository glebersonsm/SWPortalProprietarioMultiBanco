"use client";

import InputField from "@/components/InputField";
import useCloseModal from "@/hooks/useCloseModal";
import { setFormErrors } from "@/services/errors/formErrors";
import { downloadCertificates } from "@/services/querys/finance-users";
import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  ModalOverflow,
  Stack,
} from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CircularProgress } from "@mui/joy";

type DownloadCertificatesModalProps = {
  shouldOpen: boolean;
};

export default function DownloadCertificatesModal({
  shouldOpen,
}: DownloadCertificatesModalProps) {
  const closeModal = useCloseModal();

  const currentDate = format(new Date(), "yyyy-MM-dd");

  const form = useForm<{ date: string }>({
    defaultValues: {
      date: currentDate,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível emitir a certidão nesse momento, por favor tente mais tarde!",
    });
  };

  const handleDownloadCertificates = useMutation({
    mutationFn: downloadCertificates,
    onError: onErrorHandler,
  });

  const onSubmit = (data: { date: string }) => {
    handleDownloadCertificates.mutate(data.date);
  };

  return (
    <Modal open={shouldOpen} onClose={closeModal}>
      <ModalOverflow>
        <ModalDialog>
          <DialogTitle>Emitir certidão positiva/negativa</DialogTitle>
          <DialogContent sx={{ marginTop: "10px" }}>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={2}>
                  <InputField
                    field="date"
                    label="Selecione uma data"
                    type="date"
                  />
                  <Button
                    type="submit"
                    disabled={handleDownloadCertificates.isPending}
                    startDecorator={
                      handleDownloadCertificates.isPending ? <CircularProgress size="sm" sx={{ '--CircularProgress-progressColor': 'var(--CircularProgress-Color)' }} /> : null
                    }
                  >
                   {handleDownloadCertificates.isPending ? "Baixando..." : "Baixar"}
                  </Button>
                </Stack>
              </form>
            </FormProvider>
          </DialogContent>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
