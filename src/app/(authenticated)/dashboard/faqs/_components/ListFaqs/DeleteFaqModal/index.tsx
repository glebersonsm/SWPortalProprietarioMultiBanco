"use client";

import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFaq } from "@/services/querys/faqs";
import { toast } from "react-toastify";
import { Faq } from "@/utils/types/faqs";

type DeleteFaqModalProps = {
  faq: Faq;
  shouldOpen: boolean;
};

export default function DeleteFaqModal({
  faq,
  shouldOpen,
}: DeleteFaqModalProps) {
  const closeModal = useCloseModal();

  const queryClient = useQueryClient();
  const handleDeleteFaq = useMutation({
    mutationFn: deleteFaq,
  });

  const handleDelete = () => {
    handleDeleteFaq.mutate(faq.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupFaqs"] });
        toast.success(`FAQ removida com sucesso!`);
      },
      onError: (error: any) => {
        const errorMessage = error.response.data.errors[0];
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error(
            "Não foi possível deletar a FAQ nesse momento, por favor teste mais tarde!"
          );
        }
      },
      onSettled: () => {
        closeModal();
      },
    });
  };
  return (
    <>
      <AlertDialogModal
        openModal={shouldOpen}
        closeModal={closeModal}
        message={`Você tem certeza que deseja deletar a FAQ com pergunta "${faq.question}"`}
        actionText="Deletar FAQ"
        title={"Deletar FAQ"}
        onHandleAction={handleDelete}
      />
    </>
  );
}
