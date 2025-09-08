import {
  Box,
  Divider,
  FormLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import React, { ReactNode, useCallback } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Tooltip } from "@mui/material";

type DynamicMultiFormProps = {
  title: string;
  name: string;
  deleteButtonToolTip?: string;
  addButtonToolTip?: string;
  capacity?: number;
  isAdmin?: boolean;
  verifyIfIsAdmin?: boolean;
  canChangeMainHostData?: boolean;
  field: (index: number) => ReactNode;
};

const formLabelStyles = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  fontSize: 16,
  color: "var(--color-info-text)",
};

const DynamicMultiForm = ({
  title,
  name,
  deleteButtonToolTip = "Remover",
  addButtonToolTip = "Adicionar",
  field,
  isAdmin = false,
  verifyIfIsAdmin = true,
  capacity = 0,
}: DynamicMultiFormProps) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  const canAddMore =
    (capacity === 0 || fields.length < capacity) &&
    (!verifyIfIsAdmin || isAdmin);

  const renderDeleteButton = useCallback(
    (index: number) => (
      <Tooltip title={deleteButtonToolTip}>
        <IconButton
          onClick={() => remove(index)}
          aria-label={`Remover ${title.toLowerCase()} ${index + 1}`}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    ),
    [deleteButtonToolTip, remove, title]
  );

  const renderAddButton = useCallback(
    () => (
      <Tooltip title={addButtonToolTip}>
        <IconButton
          onClick={() => append({})}
          aria-label={`Adicionar ${title.toLowerCase()}`}
          sx={{ justifyContent: "start" }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip>
    ),
    [addButtonToolTip, append, title]
  );

  return (
    <Stack spacing={2}>
      <FormLabel sx={formLabelStyles}>{title}</FormLabel>

      {fields.length <= 0 && (
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
            fontSize: 12,
            color: "var(--color-info-text)",
          }}
        >
          *Não há dados disponíveis para{" "}
          <strong style={{ color: "var(--color-info-text)" }}>{title}</strong>{" "}
          no momento.
        </Typography>
      )}

      {fields.map(({ id }, index) => (
        <React.Fragment key={id}>
          <Divider />
          <Stack gap={1}>
            <Box sx={{ textAlign: "end", position: "relative", top: 8 }}>
              {index > 0 && <Box mt={1}>{renderDeleteButton(index)}</Box>}
            </Box>
            {field(index)}
          </Stack>
        </React.Fragment>
      ))}

      {canAddMore && <Box mt={1}>{renderAddButton()}</Box>}

      <Divider />
    </Stack>
  );
};

export default React.memo(DynamicMultiForm);
