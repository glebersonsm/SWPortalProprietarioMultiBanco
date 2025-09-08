"use client";

import React from "react";
import PageLayout from "../_components/PageLayout";
import Link from "@/components/Link";
import { Button } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import { usePathname } from "next/navigation";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const indexUsersPath = `/dashboard/users`;
  const isIndexPage = pathname === indexUsersPath;

  const currentTitle = isIndexPage ? "Usuários" : "Dados do usuário";

  return (
    <PageLayout
      title={
        <span style={{ color: "var(--color-title)" }}>{currentTitle}</span>
      }
      addButton={
        isIndexPage ? (
          <Link href={`${indexUsersPath}/add`} underline="none">
            <Button
              sx={{
                bgcolor: "var(--users-button-add-bg)",
                "&:hover": {
                  bgcolor: "var(--users-button-add-hover)",
                },
              }}
              startDecorator={<Add />}
            >
              Adicionar
            </Button>
          </Link>
        ) : null
      }
    >
      {children}
    </PageLayout>
  );
}
