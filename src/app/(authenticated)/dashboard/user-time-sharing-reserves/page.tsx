"use client";
import React, { ChangeEvent, useMemo, useState } from "react";
import { initialFilters } from "./constants";
import useDebounce from "@/hooks/useDebounce";
import { useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import ModernPaginatedList from "@/components/ModernPaginatedList";
import { match, P } from "ts-pattern";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import ListReserves from "./_components/ListReserves";
import UserReserveFilters from "./_components/UserReserveFilters";
// REMOVEMOS O IMPORT DO CreateReserva DAQUI
import { getUserReserves } from "@/services/querys/user-time-sharing-reserves";

export default function ReservesPage() {
  // REMOVEMOS O ESTADO DE VIEW
  const [filters, setFilters] = useState(initialFilters);
  const debounceFilters = useDebounce(filters);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Desabilita a query se estivermos em uma subrota (como /editar/[reserveNumber])
  const isMainReservesPage = pathname === '/dashboard/user-time-sharing-reserves';

  const { isLoading, data } = useQuery({
    queryKey: ["getUserReserves", debounceFilters, page, rowsPerPage],
    queryFn: async () => getUserReserves(debounceFilters, page, rowsPerPage),
    enabled: isMainReservesPage, // Só executa na página principal
  });

  const { reserves = [], lastPageNumber } = data ?? {};

  const { action, idFrontReservations } = useMemo(() => {
    const action = searchParams.get("action");
    const idFrontReservations = searchParams.get("idFrontReservations");

    return {
      action,
      idFrontReservations,
    };
  }, [searchParams]);

  const handleChangePage = (e: ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
        {/* Passamos apenas as props que ele realmente precisa agora */}
        <UserReserveFilters filters={filters} setFilters={setFilters} />
        {isLoading ? (
          <LoadingData />
        ) : reserves.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ListReserves reserves={reserves} loading={isLoading} />
              <ModernPaginatedList
                items={reserves}
                lastPageNumber={lastPageNumber}
                handleChangePage={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={(value) => {
                  setRowsPerPage(value);
                  setPage(1);
                }}
                useLocalStorage={true}
                storageKeys={{
                  pageKey: "user_reserves_page",
                  rowsPerPageKey: "user_reserves_rows_per_page",
                }}
              />
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