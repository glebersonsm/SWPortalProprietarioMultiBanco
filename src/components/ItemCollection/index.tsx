import { Box, Stack, Typography } from "@mui/joy";
import React from "react";
import Link from "../Link";

type ItemCollectionProps = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function ItemCollection({
  label,
  href,
  icon,
}: ItemCollectionProps) {
  return (
    <Link
      href={href}
      sx={{
        width: "150px",
        justifyContent: "center",
        borderRadius: "10px",
        bgcolor: "var(--color-button-primary)",
        color: "var(--color-button-text)",
        transition: "0.3s",
        "&:hover": {
          bgcolor: "var(--color-button-primary-hover)",
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.15)",
          filter: "none",
        },
      }}
      variant="soft"
      underline="none"
    >
      <Stack alignItems="center" textAlign="center">
        {icon}
        <Typography fontWeight="lg" sx={{ color: "var(--color-button-text)" }}>
          {label.toUpperCase()}
        </Typography>
      </Stack>
    </Link>
  );
}
