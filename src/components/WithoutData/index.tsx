import { Stack, Typography } from "@mui/joy";
import React from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
export default function WithoutData() {
  return (
    <Stack alignItems="center">
      <WarningAmberIcon sx={{ color: "#ccc", height: "75px", width: "75px" }} />
      <Typography level="h4" sx={{ color: "#ccc" }}>
        Não há dados para serem exibidos
      </Typography>
    </Stack>
  );
}
