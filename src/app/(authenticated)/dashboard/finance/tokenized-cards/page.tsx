"use client";

import { Divider, Stack } from "@mui/joy";
import FinanceFilters from "../outstanding-accounts/_components/OutstandingBillsFilters";
import LoadingData from "@/components/LoadingData";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { getTokenizedCards } from "@/services/querys/finance";
import WithoutData from "@/components/WithoutData";
import React, { useState } from "react";
import ListTokenizedCards from "./_components/ListTokenizedCards";
import { initialFilters } from "./contants";
import TokenizedCardsFilters from "./_components/TokenizedCardsFilters";
import { useSearchParams } from "next/navigation";
import { P, match } from "ts-pattern";
import ShowDetailsModal from "./_components/ShowDetailsModal";

export default function TokenizedCardsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const debounceFilters = useDebounce(filters);
  const searchParams = useSearchParams();

  const { isLoading, data: tokenizedCards = [] } = useQuery({
    queryKey: ["getTokenizedCards", debounceFilters],
    queryFn: async () => getTokenizedCards(debounceFilters),
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
        <TokenizedCardsFilters filters={filters} setFilters={setFilters} />
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
        .otherwise(() => null)}
    </>
  );
}
