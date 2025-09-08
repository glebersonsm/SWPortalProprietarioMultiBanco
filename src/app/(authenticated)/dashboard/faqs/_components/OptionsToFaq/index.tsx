import { Stack, Typography } from "@mui/joy";
import React from "react";

export default function OptionsToFaq() {
  return (
    <Stack spacing={1}>
      <Typography
        id="options-group"
        level="body-sm"
        fontWeight="lg"
        mb={1}
        sx={{
          color: "var(--FormLabel-color, var(--joy-palette-text-primary))",
        }}
      >
        Disponível para:
      </Typography>
    </Stack>
  );
}
