"use client";

import useCloseModal from "@/hooks/useCloseModal";
import useUser from "@/hooks/useUser";
import {
  getUserTokenizedCards,
  payByCreditCard,
} from "@/services/querys/finance-users";
import {
  UserOutstandingBill,
  UserTokenizedCard,
} from "@/utils/types/finance-users";
import {
  Button,
  DialogContent,
  DialogTitle,
  FormLabel,
  Modal,
  ModalDialog,
  ModalOverflow,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";

import "react-credit-cards-2/dist/es/styles-compiled.css";
import { formatMoney } from "@/utils/money";
import { useRouter } from "next/navigation";
import { Grid } from "@mui/material";

type PayByCreditCardProps = {
  shouldOpen: boolean;
  selectedBills: UserOutstandingBill[];
  clearSelectedAccounts: () => void;
};

export default function PayByCreditCard({
  shouldOpen,
  selectedBills,
  clearSelectedAccounts,
}: PayByCreditCardProps) {
  const { userData } = useUser();
  const closeModal = useCloseModal();
  const router = useRouter();

  const [selectedCard, setSelectedCard] = useState<UserTokenizedCard | null>(
    null
  );

  const { data: cards = [] } = useQuery({
    queryKey: ["getUserTokenizedCards"],
    queryFn: async () => getUserTokenizedCards(),
  });

  const queryClient = useQueryClient();
  const handlePayByCreditCard = useMutation({
    mutationFn: payByCreditCard,
  });

  const totalValue = () =>
    selectedBills.reduce((acc, bill) => acc + bill.currentValue, 0);

  const selectedBillsIds = () => selectedBills.map((bill) => bill.id);

  const onSubmit = () => {
    handlePayByCreditCard.mutate(
      {
        personId: userData!.personId,
        ids: selectedBillsIds(),
        totalValue: totalValue(),
        tokenizedCardId: selectedCard!.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getUserOutstandingBills"],
          });
          toast.success(
            `Pagamento de ${formatMoney(
              totalValue()
            )} realizado com sucesso criado com sucesso!`
          );
          clearSelectedAccounts();
          closeModal();
        },
        onError: () => {
          toast.error(
            "Não foi possível fazer o pagamento nesse momento, por favor tente novamente mais tarde!"
          );
          closeModal();
        },
      }
    );
  };

  return (
    <Modal open={shouldOpen} onClose={closeModal}>
      <ModalOverflow>
        <ModalDialog>
          <DialogTitle>Pagamento por cartão crédito</DialogTitle>

          <DialogContent sx={{ mt: 2, width: { xs: "100%", sm: 500 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormLabel>Selecione um cartão</FormLabel>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Select
                  value={selectedCard}
                  onChange={(e, newValue) => setSelectedCard(newValue)}
                  defaultValue={cards[0]}
                >
                  <Option value={null} key="none">
                    <Typography>Selecione um cartão</Typography>
                  </Option>
                  {cards.map((card) => (
                    <Option value={card} key={card.id}>
                      <Typography>{card.card.card_number}</Typography>
                    </Option>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Obs.: Caso não exista, favor adicione um em Finanças/Cartões</FormLabel>
              </Grid>


              {/* <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  onClick={() =>
                    router.push(`/dashboard/finance/user-tokenized-cards/add`)
                  }
                  disabled={handlePayByCreditCard.isPending}
                >
                  Adicionar novo cartão
                </Button>
              </Grid> */}

              <Grid item xs={12}>
                <Typography>
                  Valor a ser pago: {formatMoney(totalValue())}
                </Typography>
              </Grid>

              <Grid item xs={12} container justifyContent="flex-end">
                <Button
                  onClick={onSubmit}
                  disabled={handlePayByCreditCard.isPending}
                >
                  Pagar
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
