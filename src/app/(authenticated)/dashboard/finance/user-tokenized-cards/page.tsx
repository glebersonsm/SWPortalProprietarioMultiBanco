"use client";

import { Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import { useQuery } from "@tanstack/react-query";
import WithoutData from "@/components/WithoutData";
import React from "react";
import ListTokenizedCards from "./_components/ListTokenizedCards";
import { useSearchParams } from "next/navigation";
import { P, match } from "ts-pattern";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import { getUserTokenizedCards } from "@/services/querys/finance-users";
import DeleteTokenizedCardModal from "./_components/DeleteTokenizedCardModal";

export default function UserTokenizedCardsPage() {
  const searchParams = useSearchParams();

  const { isLoading, data: tokenizedCards = [] } = useQuery({
    queryKey: ["getUserTokenizedCards"],
    queryFn: async () => getUserTokenizedCards(),
  });

  const { action, tokenizedCardId } = React.useMemo(() => {
    const action = searchParams.get("action");
    const tokenizedCardId = searchParams.get("tokenizedCardId");

    return {
      action,
      tokenizedCardId,
    };
  }, [searchParams]);

  const selectedTokenizedCard = React.useMemo(
    () =>
      tokenizedCards.find(
        (tokenizedCard) => tokenizedCard.id === Number(tokenizedCardId)
      ),
    [tokenizedCards, tokenizedCardId]
  );

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        {isLoading ? (
          <LoadingData />
        ) : tokenizedCards.length === 0 ? (
          <WithoutData />
        ) : (
          <Stack spacing={2}>
            <ListTokenizedCards tokenizedCards={tokenizedCards} />
          </Stack>
        )}
      </Stack>
      {match({ action, selectedTokenizedCard })
        .with(
          { action: "show", selectedTokenizedCard: P.not(undefined) },
          ({ selectedTokenizedCard }) => (
            <ShowDetailsModal
              shouldOpen={true}
              tokenizedCard={selectedTokenizedCard}
            />
          )
        )
        .with(
          { action: "delete", selectedTokenizedCard: P.not(undefined) },
          ({ selectedTokenizedCard }) => (
            <DeleteTokenizedCardModal
              shouldOpen={true}
              tokenizedCard={selectedTokenizedCard}
            />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
