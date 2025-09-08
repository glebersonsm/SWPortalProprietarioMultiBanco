import { CircularProgress, Stack } from "@mui/joy";
import React from "react";

export default function LoadingData() {
  return (
    <Stack alignItems="center" spacing={1}>
      <div>Processando....</div>
      <CircularProgress
        variant="plain"
        sx={{
          "--CircularProgress-trackColor": "transparent",
          "--CircularProgress-progressColor": "var(--CircularProgress-Color)",
        }}
      />
    </Stack>
  );
}
