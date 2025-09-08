"use client";

import * as React from "react";
import Button from "@mui/joy/Button";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import useCloseModal from "@/hooks/useCloseModal";
import { setFormErrors } from "@/services/errors/formErrors";
import { toast } from "react-toastify";
import AlertError from "@/app/(auth)/_components/AlertError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cards from "react-credit-cards-2";
import { Grid } from "@mui/joy";
import InputMask from "@/components/InputMask";

import "react-credit-cards-2/dist/es/styles-compiled.css";
import { AddTokenizedCardData } from "@/utils/types/finance-users";
import { addTokenizedCard } from "@/services/querys/finance-users";
import { Label } from "@mui/icons-material";
import { InputLabel } from "@mui/material";

export default function AddUserTokenizedCardPage() {
  const form = useForm<AddTokenizedCardData>({
    defaultValues: {
      number: "",
      expiry: "",
      cvv: "",
      name: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível registrar o cartão de crédito nesse momento, por favor tente mais tarde!",
    });
  };

  const closeModal = useCloseModal();
  const queryClient = useQueryClient();
  const handleAddTokenizedCard = useMutation({
    mutationFn: addTokenizedCard,
    onError: onErrorHandler,
  });

  const watchNumber = watch("number", "");
  const watchExpiry = watch("expiry", "");
  const watchCvv = watch("cvv", "");
  const watchName = watch("name", "");

  function onSubmit(data: AddTokenizedCardData) {
    handleAddTokenizedCard.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getUserTokenizedCards"],
        });
        toast.success(`Cartão de crédito registrado com sucesso!`);
        closeModal();
      },
    });
  }

  return (
    <FormProvider {...form}>
      <Cards
        number={watchNumber}
        expiry={watchExpiry}
        cvc={watchCvv}
        name={watchName}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid xs={12} sm={12}>
            <InputField label="Nome no cartão" field="name" />
          </Grid>
          <Grid xs={12} sm={12}>
            <InputMask
              label="Número"
              field="number"
              mask="9999 9999 9999 9999"
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <InputMask label="Data de expiração" field="expiry" mask="99/99" />
          </Grid>

          <Grid xs={12} sm={6}>
            <InputMask label="CVV" field="cvv" mask="999" />
          </Grid>
          <Grid xs={12} sm={8}>
            <AlertError error={errors.root?.generalError?.message} />
          </Grid>
          <Grid xs={12} sm={12}>
            <Button sx={{ width: "100%" }} type="submit">
              Adicionar
            </Button>
          </Grid>
          <Grid xs={12} sm={12}>
            <InputLabel sx={{ width: "100%", color: "red" }}>
              Obs.: O token ficará válido para realização de pagamentos por apenas 30 minutos.
            </InputLabel>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
