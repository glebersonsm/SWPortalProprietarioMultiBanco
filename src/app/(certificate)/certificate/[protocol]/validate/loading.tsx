import LoadingData from "@/components/LoadingData";
import { Stack } from "@mui/joy";
import React from "react";

export default function ValidateLoading() {
  return (
    <Stack alignItems="center" minHeight="100vh" justifyContent="center">
      <LoadingData />;
    </Stack>
  );
}
