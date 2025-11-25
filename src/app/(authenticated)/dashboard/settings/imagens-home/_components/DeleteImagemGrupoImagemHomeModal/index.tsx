import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteImagemGrupoImagemHome, ImagemGrupoImagemHome } from "@/services/querys/imagem-grupo-imagem-home";
import { toast } from "react-toastify";

type DeleteImagemGrupoImagemHomeModalProps = {
  imagem: ImagemGrupoImagemHome;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeleteImagemGrupoImagemHomeModal({
  imagem,
  open,
  onClose,
  onSuccess,
}: DeleteImagemGrupoImagemHomeModalProps) {
  const queryClient = useQueryClient();

  const handleDeleteImagem = useMutation({
    mutationFn: deleteImagemGrupoImagemHome,
  });

  const handleDelete = () => {
    if (!imagem.id) return;

    handleDeleteImagem.mutate(imagem.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["imagensGrupoImagemHome"] });
        queryClient.invalidateQueries({ queryKey: ["gruposImagemHome"] });
        toast.success(`Imagem ${imagem.name} removida com sucesso!`);
        onSuccess();
        onClose();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.errors?.[0];
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error(
            "Não foi possível deletar a imagem nesse momento, por favor tente mais tarde!"
          );
        }
        onClose();
      },
    });
  };

  return (
    <AlertDialogModal
      openModal={open}
      closeModal={onClose}
      message={`Você tem certeza que deseja deletar a imagem "${imagem.name}"?`}
      actionText="Deletar imagem"
      title="Deletar Imagem"
      onHandleAction={handleDelete}
    />
  );
}

