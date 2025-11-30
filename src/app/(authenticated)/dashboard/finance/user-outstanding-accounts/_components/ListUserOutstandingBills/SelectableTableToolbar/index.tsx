"use client";

import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Stack, Button } from "@mui/joy";
import { UserOutstandingBill } from "@/utils/types/finance-users";
import { formatMoney } from "@/utils/money";
import useUser from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { getUserTokenizedCards } from "@/services/querys/finance-users";

type ModalPayload =
  | { type: "payByCreditCard"; params: { bills: number[] } }
  | { type: "payPerPix"; params: { bills: number[] } };

export function SelectableTableToolbar({
  selectedBills,
  onOpenModal,
}: {
  selectedBills: readonly UserOutstandingBill[];
  onOpenModal?: (payload: ModalPayload) => void;
}) {
  const { settingsParams } = useUser();

  const sumBills = () =>
    formatMoney(
      selectedBills.reduce((acc, bill) => acc + bill.currentValue, 0)
    );

  const selectedBillsIds = () => selectedBills.map((item) => item.id);

  const { data: cards = [] } = useQuery({
    queryKey: ["getUserTokenizedCards"],
    queryFn: getUserTokenizedCards,
  });
  const hasCards = cards.length > 0;

  const handleOpen = (payload: ModalPayload) => {
    onOpenModal?.(payload);
  };

  // Não mostra a toolbar se não houver itens selecionados ou se o pagamento online não estiver habilitado
  if (selectedBills.length === 0 || !settingsParams?.enableOnlinePayment) return null;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        pt: "5px",
        pb: "5px",
        justifyContent: "space-between",
        bgcolor: (theme) =>
          alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity
          ),
      }}
    >
      <Typography
        color="inherit"
        variant="body1"
        fontWeight={600}
        component="div"
      >
        TOTAL = {sumBills()}
      </Typography>

      <Stack gap={2} flexDirection="row">
        {settingsParams?.enableCardPayment && (
          <Button
            onClick={() =>
              handleOpen({
                type: "payByCreditCard",
                params: { bills: selectedBillsIds() },
              })
            }
            sx={{
              backgroundColor: "var(--color-button-primary)",
              color: "var(--color-button-text)",
              fontWeight: 600,
              borderRadius: "8px",
              padding: "8px 16px",
              border: "none",
              boxShadow: "none",
              textTransform: "none",
              fontFamily: "Montserrat, sans-serif",
              "&:hover": {
                backgroundColor: "var(--color-button-primary-hover)",
              },
              "&:focus": {
                outline: "none",
                boxShadow: "0 0 0 2px var(--color-highlight-border)",
              },
            }}
          >
            Pagar com cartão
          </Button>
        )}

        {settingsParams?.enablePixPayment && (
          <Button
            onClick={() =>
              handleOpen({
                type: "payPerPix",
                params: { bills: selectedBillsIds() },
              })
            }
            sx={{
              backgroundColor: "var(--color-button-primary)",
              color: "var(--color-button-text)",
              fontWeight: 600,
              borderRadius: "8px",
              padding: "8px 16px",
              border: "none",
              boxShadow: "none",
              textTransform: "none",
              fontFamily: "Montserrat, sans-serif",
              "&:hover": {
                backgroundColor: "var(--color-button-primary-hover)",
              },
              "&:focus": {
                outline: "none",
                boxShadow: "0 0 0 2px var(--color-highlight-border)",
              },
            }}
          >
            Pagar por pix
          </Button>
        )}
      </Stack>
    </Toolbar>
  );
}
