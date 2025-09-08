"use client";

import LoadingData from "@/components/LoadingData";
import useCloseModal from "@/hooks/useCloseModal";
import useUser from "@/hooks/useUser";
import { generateQRCode } from "@/services/querys/finance-users";
import { formatMoney } from "@/utils/money";
import { UserOutstandingBill } from "@/utils/types/finance-users";
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  ModalOverflow,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

type PayPerPixModalProps = {
  shouldOpen: boolean;
  selectedBills: UserOutstandingBill[];
  clearSelectedAccounts: () => void;
};

export default function PayPerPixModal({
  shouldOpen,
  selectedBills,
  clearSelectedAccounts,
}: PayPerPixModalProps) {
  const [qrCode, setQrCode] = useState("");
  const { userData } = useUser();
  const closeModal = useCloseModal();

  const queryClient = useQueryClient();
  const handleGenerateQRCode = useMutation({
    mutationFn: generateQRCode,
  });

  const totalValue = () =>
    selectedBills.reduce((acc, bill) => acc + bill.currentValue, 0);

  const selectedBillsIds = () => selectedBills.map((bill) => bill.id);

  const handleCloseModal = () => {
    setQrCode("");
    closeModal();
  };

  const handleGenerateQrCode = () => {
    handleGenerateQRCode.mutate(
      {
        personId: userData!.personId,
        ids: selectedBillsIds(),
        totalValue: totalValue(),
      },
      {
        onSuccess: (data) => {
          setQrCode(data.qrCode);
          clearSelectedAccounts();
        },
        onError: () => {
          toast.error(
            "Não foi possível gerar o QR-Code, por favor tente novamente mais tarde!"
          );
          handleCloseModal();
        },
      }
    );
  };

  return (
    <Modal open={shouldOpen} onClose={handleCloseModal}>
      <ModalOverflow>
        <ModalDialog>
          <DialogTitle>Pagamento por QR-Code</DialogTitle>
          <DialogContent sx={{ marginTop: "10px" }}>
            <Stack>
              {handleGenerateQRCode.isPending ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "500px",
                    width: "500px",
                  }}
                >
                  <LoadingData />
                </Box>
              ) : qrCode ? (
                <Stack
                  textAlign="center"
                  gap={3}
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 500,
                    width: "100%",
                  }}
                >
                  <QRCode
                    size={500}
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                    value={qrCode}
                    viewBox={`0 0 256 256`}
                  />
                  <Typography level="title-md">
                    Valor a ser pago: {formatMoney(totalValue())}
                  </Typography>
                </Stack>
              ) : (
                <Stack gap={3}>
                  <Image
                    src="/assets/pre-qrcode.jpeg"
                    alt="Qrcode"
                    width={500}
                    height={500}
                  />
                  <Button onClick={handleGenerateQrCode}>Gerar QrCode</Button>
                </Stack>
              )}
            </Stack>
          </DialogContent>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
