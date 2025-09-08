import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useCloseModal from "@/hooks/useCloseModal";
import { Transaction } from "@/utils/types/finance";
import { cancelTransaction } from "@/services/querys/finance";

type CancelTransactionProps = {
  transaction: Transaction;
  shouldOpen: boolean;
};

export default function CancelTransaction({
  transaction,
  shouldOpen,
}: CancelTransactionProps) {
  const queryClient = useQueryClient();
  const handleCancelTransaction = useMutation({
    mutationFn: cancelTransaction,
  });

  const closeModal = useCloseModal();

  const handleDelete = () => {
    handleCancelTransaction.mutate(transaction.paymentId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getTransactions"] });
        toast.success(
          `Transação de id ${transaction.transactionId} foi cancelada com sucesso!`
        );
      },
      onError: (error: any) => {
        const errorMessage = error.response.data.errors[0];
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error(
            "Não foi possível cancelar a transação nesse momento, por favor teste mais tarde!"
          );
        }
      },
      onSettled: () => {
        closeModal();
      },
    });
  };

  return (
    <AlertDialogModal
      openModal={shouldOpen}
      closeModal={closeModal}
      message={`Atenção, a correção de status e dos valores da parcelas vinculadas à essa transação, deverão ser realizados diretamente no sistema legado, após esse cencelamento! Você tem certeza que deseja cancelar a transação de id ${transaction.transactionId}`}
      actionText="Confirmar cancelamento"
      title={"Cancelar Transação"}
      onHandleAction={handleDelete}
    />
  );
}
