"use client";

import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDadosVoucher } from "@/services/querys/user-multiownership-contracts";
import { useRef } from "react";
import { Box, Modal, Button, Divider } from "@mui/material";
import useCloseModal from "@/hooks/useCloseModal";
import { VoucherPt } from "./voucherPt";
import { VoucherEp } from "./voucherEp";

interface Props {
  shouldOpen: boolean;
  appointmentId: string | number;
}

interface ModalProps {
  children: ReactNode;
}

const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export const Voucher = ({ appointmentId, shouldOpen }: Props) => {
  const closeModal = useCloseModal();
  const contentRef = useRef<HTMLDivElement>(null);
  const [info, _] = useState(() => {
    if (thereIsLocalStorage) {
      const item = localStorage.getItem("info_user_pix_conta_idioma");
      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const { data } = useQuery({
    queryKey: ["getUserAppointmentsMultiOwnership", { appointmentId }],
    queryFn: () =>
      getDadosVoucher({
        agendamentoId: appointmentId,
      }),
  });

  const idioma = info?.idioma ?? 0;

  const handlePrint = async () => {
    if (contentRef.current) {
      const html2pdf = (await import("html2pdf.js")).default;
      html2pdf()
        .from(contentRef.current)
        .set({
          margin: 0.5,
          filename: "voucher-my-mabu.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .save();
    }
  };

  const ModalC = ({ children }: ModalProps) => (
    <Modal open={shouldOpen} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 800,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box textAlign="right" mb={2}>
          <Button
            onClick={handlePrint}
            sx={{
              color: "var(--color-button-text)",
              backgroundColor: "var(--color-button-primary)",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "var(--color-button-primary-hover)",
              },
            }}
          >
            Baixar voucher
          </Button>
        </Box>
        <Divider />
        <Box ref={contentRef}>{children}</Box>
      </Box>
    </Modal>
  );

  switch (idioma) {
    case 0:
      return (
        <ModalC>
          <VoucherPt data={data} />
        </ModalC>
      );
    case 2:
      return (
        <ModalC>
          <VoucherEp data={data} />
        </ModalC>
      );
  }
};
