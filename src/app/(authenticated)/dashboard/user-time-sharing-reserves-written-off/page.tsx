"use client";
import React, { ChangeEvent, useMemo, useState } from "react";
import { initialFilters } from "./constants";
import useDebounce from "@/hooks/useDebounce";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import { Pagination } from "@mui/material";
import { match, P } from "ts-pattern";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import { getUserReservesWrittenOff } from "@/services/querys/user-time-sharing-reservesWrittenOff";
import ListUserReservesWrittenOff from "./_components/ListReservesWrittenOff";
import UserReserveWrittenOffFilters from "./_components/UserReserveWrittenOffFilters";

export default function ReservesWrittenOffPage() {
  const [filters, setFilters] = useState(initialFilters);
  const debounceFilters = useDebounce(filters);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  const { isLoading, data } = useQuery({
    queryKey: ["getUserReservesWrittenOff", debounceFilters, page],
    queryFn: async () => getUserReservesWrittenOff(debounceFilters, page),
  });

  const { reservesWrittenOff = [], lastPageNumber } = data ?? {};

  const { action, tsSaleId } = useMemo(() => {
    const action = searchParams.get("action");
    const tsSaleId = searchParams.get("tsSaleId");

    return {
      action,
      tsSaleId,
    };
  }, [searchParams]);

  const handleChangePage = (e: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const selectedReserve = useMemo(
    () =>
      reservesWrittenOff.find(
        (contract) => contract.tsSaleId === Number(tsSaleId)
      ),
    [reservesWrittenOff, tsSaleId]
  );

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <UserReserveWrittenOffFilters
          filters={filters}
          setFilters={setFilters}
        />
        {isLoading ? (
          <LoadingData />
        ) : reservesWrittenOff.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ListUserReservesWrittenOff reserves={reservesWrittenOff} />
              <Box alignSelf="flex-end" marginTop="8px">
                <Pagination
                  variant="outlined"
                  size="large"
                  count={lastPageNumber}
                  onChange={handleChangePage}
                  page={page}
                />
              </Box>
            </Stack>
          </>
        )}
      </Stack>
      {match({ action, selectedReserve })
        .with(
          { action: "show", selectedReserve: P.not(undefined) },
          ({ selectedReserve }) => (
            <ShowDetailsModal shouldOpen={true} reserve={selectedReserve} />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
