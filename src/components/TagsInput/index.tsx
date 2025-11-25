import Autocomplete from "@mui/joy/Autocomplete";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useFormContext } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTag, getTags } from "@/services/querys/tags";
import { toast } from "react-toastify";

type TagsInputProps = {
  disabled?: boolean;
  name?: string;
};

export default function TagsInput({
  disabled = false,
  name = "requiredTags",
}: TagsInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState("");

  const {
    isLoading,
    isError,
    data: tags = [],
  } = useQuery({ queryKey: ["getTags"], queryFn: getTags });

  const handleAddTag = useMutation({ mutationFn: addTag });

  const handleAddButtonClick = () => {
    handleAddTag.mutate(inputValue, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getTags"] }),
      onError: () => {
        toast.error("Não foi possível criar uma nova tag!");
      },
    });
  };

  return (
    <FormControl error={!!errors?.root?.generalError}>
      <FormLabel>Tags</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentValue = field.value || [];
          
          const handleDeleteTag = (tagToDelete: any) => {
            const newValue = currentValue.filter(
              (tag: any) => tag.id !== tagToDelete.id
            );
            field.onChange(newValue);
          };

          return (
            <Autocomplete
              {...field}
              multiple
              disabled={isError || isLoading || disabled}
              placeholder="Insira as tags"
              inputValue={inputValue}
              value={currentValue}
              onChange={(e, value) => field.onChange(value || [])}
              onInputChange={(e, newValue) => setInputValue(newValue)}
              limitTags={2}
              options={tags}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const tagProps = getTagProps({ index });
                  const { key, ...rest } = tagProps as any;
                  return (
                    <Chip
                      key={key}
                      {...rest}
                      variant="soft"
                      color="primary"
                      endDecorator={
                        <ChipDelete
                          onDelete={(e) => {
                            e?.stopPropagation();
                            e?.preventDefault();
                            handleDeleteTag(option);
                          }}
                        />
                      }
                    >
                      {option.name}
                    </Chip>
                  );
                })
              }
              noOptionsText={
                <Button
                  startDecorator={<AddIcon />}
                  variant="plain"
                  onClick={handleAddButtonClick}
                  fullWidth
                  sx={{ justifyContent: "start" }}
                  disabled={handleAddTag.isPending}
                >
                  Adicionar &quot;{inputValue}&quot;
                </Button>
              }
            />
          );
        }}
      />
      {isError ? (
        <FormHelperText sx={{ color: "red", marginLeft: 0 }}>
          Não foi possível carregar as tags
        </FormHelperText>
      ) : null}
    </FormControl>
  );
}
