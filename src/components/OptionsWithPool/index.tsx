import CheckboxField from "@/components/CheckboxField";
import { Stack } from "@mui/joy";
import React from "react";

export default function OptionsWithPool() {
  return (
    <Stack spacing={2}>
      <CheckboxField label="Disponível" field="available" />
    </Stack>
  );
}
