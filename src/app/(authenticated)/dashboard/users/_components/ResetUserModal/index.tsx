"use client";

import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import { CompleteUser } from "@/utils/types/users";
import useCloseModal from "@/hooks/useCloseModal";
import { toast } from "react-toastify";
import { resetPassword } from "@/services/querys/users";
import { useMutation } from "@tanstack/react-query";

type ResetUserModalProps = {
  user: CompleteUser;
  shouldOpen: boolean;
};
export default function ResetUserModal({
  user,
  shouldOpen,
}: ResetUserModalProps) {
  const closeModal = useCloseModal();

  const handleResetPassword = useMutation({
    mutationFn: resetPassword,
  });

  async function handleReset() {
    handleResetPassword.mutate(user.login, {
      onSuccess: () => {
        toast.success(
          `A senha do usuário ${user.name} foi resetada com sucesso, por favor verifique o e-mail cadastrado!`
        );
      },
      onError: () => {
        toast.error(
          `Não foi possível resetar a senha do usuário ${user.name}!`
        );
      },
      onSettled: () => {
        closeModal();
      },
    });
  }

  return (
    <AlertDialogModal
      openModal={shouldOpen}
      closeModal={closeModal}
      message={`Você tem certeza que deseja resetar a senha do usuário ${user.name}`}
      actionText="Resetar senha"
      title={"Resetar senha do usuário"}
      onHandleAction={handleReset}
    />
  );
}
