"use client";

import React from "react";
import PageLayout from "../_components/PageLayout";
import { usePathname } from "next/navigation";
import ButtonOpenModal from "@/components/ButtonOpenModal";
import Add from "@mui/icons-material/Add";
import Link from "@/components/Link";
import { Button } from "@mui/joy";
import DownloadIcon from "@mui/icons-material/Download";

export default function EmailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function getPageName() {
    switch (pathname) {
      case `/dashboard/finance/outstanding-accounts`:
        return "Contas à receber";
      case `/dashboard/finance/transactions`:
        return "Transações";
      case `/dashboard/finance/tokenized-cards`:
        return "Cartões tokenizados";
      case `/dashboard/finance/user-tokenized-cards`:
        return "Cartões tokenizados";
      case `/dashboard/finance/user-outstanding-accounts`:
        return "Minhas contas";
      case `/dashboard/finance/user-tokenized-cards/add`:
        return "Adicionar cartão";
      default:
        return "Finanças";
    }
  }

  const currentPage = getPageName();

  function getButton() {
    switch (currentPage) {
      case "Cartões tokenizados":
        return (
          <Link
            href={`/dashboard/finance/user-tokenized-cards/add`}
            underline="none"
          >
            <Button
              sx={{
                bgcolor: "#035781",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                transition: "0.6s",
                "&:hover": {
                  bgcolor: "#2ca2cc",
                },
              }}
              startDecorator={<Add />}
            >
              {" "}
              Adicionar token
            </Button>
          </Link>
        );
      //  case "Minhas contas pendentes":
      //    return (
      //      <ButtonOpenModal
      //        sx={{
      //          bgcolor: "#035781",
      //          fontFamily: "Montserrat, sans-serif",
      //          fontWeight: 500,
      //          transition: "0.6s",
      //          "&:hover": {
      //            bgcolor: "#2ca2cc",
      //          },
      //        }}
      //        type="download-certificates"
      //        startIcon={<DownloadIcon />}
      //        text="Emitir certidão"
      //      />
      //    );

      default:
        return null;
    }
  }

  return (
    <PageLayout
      title={<span style={{ color: "var(--color-title)" }}>{currentPage}</span>}
      addButton={getButton()}
    >
      {children}
    </PageLayout>
  );
}
