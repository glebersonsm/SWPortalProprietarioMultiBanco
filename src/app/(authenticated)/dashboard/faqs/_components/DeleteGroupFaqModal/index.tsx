"use client";

import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroupFaqs } from "@/services/querys/groupsFaqs";
import { toast } from "react-toastify";
import { GroupFaq } from "@/utils/types/faqs";

type DeleteGroupFaqModalProps = {
  groupFaqs: GroupFaq;
  shouldOpen: boolean;
};

export default function DeleteGroupFaqModal({
  groupFaqs,
  shouldOpen,
}: DeleteGroupFaqModalProps) {
  const closeModal = useCloseModal();

  const queryClient = useQueryClient();
  const handleDeleteGroupFaqs = useMutation({
    mutationFn: deleteGroupFaqs,
  });

  const handleDelete = () => {
    handleDeleteGroupFaqs.mutate(groupFaqs.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupFaqs"] });
        toast.success(`Grupo de FAQs ${groupFaqs.name} removido com sucesso!`);
      },
      onError: (error: any) => {
        const errorMessage = error.response.data.errors[0];
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error(
            "Não foi possível deletar o grupo de FAQs nesse momento, por favor teste mais tarde!"
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
        message={`Você tem certeza que deseja deletar o grupo de FAQs ${groupFaqs.name}`}
        actionText="Deletar grupo"
        title={"Deletar Grupo de FAQs"}
        onHandleAction={handleDelete}
      />
    </>
  );
}
