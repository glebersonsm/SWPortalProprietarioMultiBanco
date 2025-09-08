"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { Stack } from "@mui/joy";
import ItemCollection from "@/components/ItemCollection";
import PaymentsIcon from "@mui/icons-material/Payments";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import useUser from "@/hooks/useUser";
import GradingIcon from "@mui/icons-material/Grading";
import { match } from "ts-pattern";
import ValidateCertificateModal from "./_components/ValidateCertificateModal";
import CreditCardIcon from "@mui/icons-material/CreditCard";

export default function FinancePage() {
  const { isAdm, gestorFinanceiro } = useUser();
  const searchParams = useSearchParams();

  const { action } = React.useMemo(() => {
    const action = searchParams.get("action");

    return {
      action,
    };
  }, [searchParams]);

  return (
    <>
      <Stack gap={4} flexDirection="row">
        {isAdm || gestorFinanceiro === 1 ? (<ItemCollection
          label = "Contas à receber"
          href={`/dashboard/finance/outstanding-accounts`}
          icon={<CardTravelIcon sx={{ fontSize: 80, color:"white" }} />}
        />
        ) : (<ItemCollection
          label = "Minhas contas"
          href={`/dashboard/finance/user-outstanding-accounts`}
          icon={<CardTravelIcon sx={{ fontSize: 80, color:"white" }} />}
        />)}

        {isAdm || gestorFinanceiro === 1 ? (
          <ItemCollection
            label="Transações"
            href={`/dashboard/finance/transactions`}
            icon={<PaymentsIcon sx={{ fontSize: 80, color:"white" }} />}
          />
        ) : ( null
          // <ItemCollection
          //   label="Cartões"
          //   href={`/dashboard/finance/user-tokenized-cards`}
          //   icon={<CreditCardIcon sx={{ fontSize: 80, color:"white" }} />}
          // />
        )}

        {/* <ItemCollection
          label="Validar certidão"
          href={`/dashboard/finance?action=validate-certificate`}
          icon={<GradingIcon sx={{ fontSize: 80, color:"white" }} />}
        /> */}
      </Stack>
      {match({ action })
        .with({ action: "validate-certificate" }, () => (
          <ValidateCertificateModal shouldOpen={true} />
        ))
        .otherwise(() => null)}
    </>
  );
}
