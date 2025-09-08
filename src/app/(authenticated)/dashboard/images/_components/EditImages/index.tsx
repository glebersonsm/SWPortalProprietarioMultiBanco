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
import TagsInput from "@/components/TagsInput";
import { Image } from "@/utils/types/images";
import { EditImage } from "@/services/querys/images";
import { RequiredTags } from "@/utils/types/tags";

type Props = {
  image: Image;
  groupImages: GroupImages;
  shouldOpen: boolean;
};

type DataFormProps = {
  id: number;
  name: string;
  requiredTags: RequiredTags[] | null;
};

export default function EditImages({ image, groupImages, shouldOpen }: Props) {
  const form = useForm<DataFormProps>({
    defaultValues: {
      id: image.id,
      name: image.name,
      requiredTags: [], 
    },
  });

  const {
    formState: { errors },
    handleSubmit,
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível editar a imagem nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();

  const handleEditImage = useMutation({
    mutationFn: EditImage,
    onError: onErrorHandler,
  });

  const closeModal = useCloseModal();

  function onSubmit(data: DataFormProps) {
    handleEditImage.mutate(
      {
        id: data.id,
        tagsRequeridas:
          data.requiredTags?.length
            ? data.requiredTags.map((tag) => tag.id)
            : null,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getGroupsImages"] });
          toast.success(`Imagem ${data.name} editada com sucesso!`);
          closeModal();
        },
      }
    );
  }

  return (
    <FormModal
      open={shouldOpen}
      closeModal={closeModal}
      title="Editar imagem"
      contentText={`Edite os dados da imagem do grupo ${groupImages.name}`}
      type="edit"
      form={form}
      onSubmit={onSubmit}
      errorMessage={errors.root?.generalError?.message}
    >
      <InputField label="Nome da imagem" field="name" />
      <TagsInput name="requiredTags" />
    </FormModal>
  );
}
