import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@mui/joy";
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
        render={({ field }) => (
          <Autocomplete
            {...field}
            multiple
            disabled={isError || isLoading || disabled}
            placeholder="Insira as tags"
            inputValue={inputValue}
            value={field.value}
            onChange={(e, value) => field.onChange(value)}
            onInputChange={(e, newValue) => setInputValue(newValue)}
            limitTags={2}
            options={tags}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
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
        )}
      />
      {isError ? (
        <FormHelperText sx={{ color: "red", marginLeft: 0 }}>
          Não foi possível carregar as tags
        </FormHelperText>
      ) : null}
    </FormControl>
  );
}
