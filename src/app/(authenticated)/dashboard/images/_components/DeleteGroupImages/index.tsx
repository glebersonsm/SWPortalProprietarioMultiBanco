import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useCloseModal from "@/hooks/useCloseModal";
import { GroupImages } from "@/utils/types/groupImages";
import { deleteGroupImages } from "@/services/querys/groupImages";

type DeleteGroupImagesModalProps = {
  groupImages: GroupImages;
  shouldOpen: boolean;
};

export default function DeleteGroupImagesModal({
  groupImages,
  shouldOpen,
}: DeleteGroupImagesModalProps) {
  const queryClient = useQueryClient();
  const handleDeleteGroupImages = useMutation({
    mutationFn: deleteGroupImages,
  });

  const closeModal = useCloseModal();

  const handleDelete = () => {
    handleDeleteGroupImages.mutate(groupImages.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupsImages"] });
        toast.success(
          `Grupo de imagens ${groupImages.name} removido com sucesso!`
        );
      },
      onError: (error: any) => {
        const errorMessage = error.response.data.errors[0];
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error(
            "Não foi possível deletar o grupo de imagens nesse momento, por favor teste mais tarde!"
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
      message={`Você tem certeza que deseja deletar o grupo de imagens ${groupImages.name}`}
      actionText="Deletar grupo"
      title={"Deletar Grupo de Imagens"}
      onHandleAction={handleDelete}
    />
  );
}
