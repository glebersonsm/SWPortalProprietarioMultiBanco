"use client";
import React, { ChangeEvent, useMemo, useState } from "react";
import { initialFilters } from "./constants";
import { useSearchParams } from "next/navigation";
import { Box, Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import { Pagination } from "@mui/material";
import { match, P } from "ts-pattern";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import ListReserves from "./_components/ListReserves";
import ReserveFilters from "./_components/ReserveFilters";
import { useGetReserves } from "./hook";

export default function ReservesPage() {
  const [filters, setFilters] = useState(initialFilters);
  const searchParams = useSearchParams();

  const { data, handleFiltersChange, handlePageChange, isLoading, page } =
    useGetReserves();

  const { reserves = [], lastPageNumber } = data ?? {};

  const { action, idFrontReservations } = useMemo(() => {
    const action = searchParams.get("action");
    const idFrontReservations = searchParams.get("idFrontReservations");

    return {
      action,
      idFrontReservations,
    };
  }, [searchParams]);

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    handlePageChange(value);
  };

  const handleSearch = () => {
    handleFiltersChange(filters);
  };

  const selectedReserve = useMemo(
    () =>
      reserves.find(
        (contract) =>
          contract.idFrontReservations === Number(idFrontReservations)
      ),
    [reserves, idFrontReservations]
  );

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <ReserveFilters
          filters={filters}
          setFilters={setFilters}
          handleSearch={handleSearch}
        />
        {isLoading ? (
          <LoadingData />
        ) : reserves.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ListReserves reserves={reserves} />
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
