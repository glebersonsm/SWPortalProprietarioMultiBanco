import * as React from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import FormModal from "@/components/FormModal";
import { setFormErrors } from "@/services/errors/formErrors";
import { toast } from "react-toastify";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GroupImages } from "@/utils/types/groupImages";
import { editGroupImages } from "@/services/querys/groupImages";
import TagsInput from "@/components/TagsInput";

type EditGroupImagesModalProps = {
  groupImages: GroupImages;
  shouldOpen: boolean;
};

export default function EditGroupImagesModal({
  groupImages,
  shouldOpen,
}: EditGroupImagesModalProps) {
  const form = useForm<GroupImages>({
    defaultValues: {
      ...groupImages,
      requiredTags: groupImages.requiredTags ?? [],
    },
  });

  const {
    formState: { errors },
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível editar o grupo de documentos nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleEditGroupImages = useMutation({
    mutationFn: editGroupImages,
    onError: onErrorHandler,
  });

  const closeModal = useCloseModal();

  function onSubmit(data: GroupImages) {
    handleEditGroupImages.mutate(
      {
        ...data,
        tagsRequeridas:
          data.requiredTags?.values != null
            ? data.requiredTags?.map((tag) => tag.id)
            : null,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getGroupsImages"] });
          toast.success(`Grupo de imagens ${data.name} editado com sucesso!`);
          closeModal();
        },
      }
    );
  }

  return (
    <FormModal
      open={shouldOpen}
      closeModal={closeModal}
      title="Editar grupo de imagens"
      contentText={`Grupo de imagens: ${groupImages.name}`}
      type="edit"
      form={form}
      onSubmit={onSubmit}
      errorMessage={errors.root?.generalError?.message}
    >
      <InputField label="Nome do grupo de imagens" field="name" />
      <TagsInput />
    </FormModal>
  );
}
