import { Divider, Stack, Typography } from "@mui/joy";
import { ReactElement, ReactNode } from "react";

type PageLayoutProps = {
  title: ReactNode;
  children: ReactNode;
  addButton?: ReactElement | null;
};

export default function PageLayout({
  title,
  children,
  addButton,
}: PageLayoutProps) {
  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          level="h4"
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 800,
            letterSpacing: "0.05em",
            color: "var(--color-title)",
          }}
        >
          {title}
        </Typography>
        {addButton}
      </Stack>
      <Divider
        sx={{
          borderColor: "primary.300",
          "&::before, &::after": {
            borderColor: "primary.300",
          },
        }}
      />
      {children}
    </Stack>
  );
}
