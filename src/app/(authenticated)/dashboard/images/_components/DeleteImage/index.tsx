import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Image } from "@/utils/types/images";
import { deleteImage } from "@/services/querys/images";

type DeleteImageModalProps = {
  image: Image;
  shouldOpen: boolean;
};

export default function DeleteImageModal({
  image,
  shouldOpen,
}: DeleteImageModalProps) {
  const queryClient = useQueryClient();
  const handleDeleteImage = useMutation({ mutationFn: deleteImage });

  const closeModal = useCloseModal();

  const handleDelete = () => {
    handleDeleteImage.mutate(image.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupsImages"] });
        toast.success(`Imagem ${image.name} removida com sucesso!`);
      },
      onError: () => {
        toast.error(
          "Não foi possível deletar a imagem nesse momento, por favor teste mais tarde!"
        );
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
        message={`Você tem certeza que deseja deletar a imagem ${image.name}`}
        actionText="Deletar imagem"
        title={"Deletar imagem"}
        onHandleAction={handleDelete}
      />
    </>
  );
}
