import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useCloseModal from "@/hooks/useCloseModal";
import { TokenizedCard } from "@/utils/types/finance";
import { deleteUserTokenizedCard } from "@/services/querys/finance-users";

type DeleteTokenizedCardProps = {
  tokenizedCard: TokenizedCard;
  shouldOpen: boolean;
};

export default function DeleteTokenizedCardModal({
  tokenizedCard,
  shouldOpen,
}: DeleteTokenizedCardProps) {
  const queryClient = useQueryClient();
  const handleDeleteTokenizedCard = useMutation({
    mutationFn: deleteUserTokenizedCard,
  });

  const closeModal = useCloseModal();

  const handleDelete = () => {
    handleDeleteTokenizedCard.mutate(tokenizedCard.id, {
      onSuccess: () => {
        queryClient.setQueryData(["getUserTokenizedCards"], (oldData: TokenizedCard[] | undefined) => {
          return oldData?.filter((card) => card.id !== tokenizedCard.id) || [];
        });
        toast.success(
          `Cartão ${tokenizedCard.card.card_number} removido com sucesso!`
        );
      },
      onError: (error: any) => {
        const errorMessage = error.response.data.errors[0];
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error(
            "Não foi possível deletar o cartão nesse momento, por favor teste mais tarde!"
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
      message={`Você tem certeza que deseja deletar o cartão de número ${tokenizedCard.card.card_number}`}
      actionText="Deletar"
      title={"Deletar Cartão Tokenizado"}
      onHandleAction={handleDelete}
    />
  );
}
