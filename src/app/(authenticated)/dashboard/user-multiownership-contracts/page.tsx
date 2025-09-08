"use client";

import LoadingData from "@/components/LoadingData";
import useDebounce from "@/hooks/useDebounce";
import { Box, Divider, Stack } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import WithoutData from "@/components/WithoutData";
import { getOwners } from "@/services/querys/user-multiownership-contracts";
import ListMyContracts from "./_components/ListMyContracts";
import { initialFilters } from "./constants";
import { P, match } from "ts-pattern";
import ShowDetailsModal from "./_components/ShowDetailsModal";
import PaginatedList from "@/components/PaginatedList";
import { ModalSchedulingUser } from "./_components/ModalScheduling";

const PAGE_STORAGE_KEY = "user_multiownership_contracts_page";
const ROWS_PER_PAGE_STORAGE_KEY = "user_multiownership_contracts_rows_per_page";

export default function PropertiesPage() {
  const [filters] = React.useState(initialFilters);
  const debounceFilters = useDebounce(filters);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(() => {
    return Number(localStorage.getItem(PAGE_STORAGE_KEY)) || 1;
  });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    return Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY)) || 10;
  });

  useEffect(() => {
    localStorage.setItem(PAGE_STORAGE_KEY, page.toString());
  }, [page]);

  useEffect(() => {
    localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, rowsPerPage.toString());
  }, [rowsPerPage]);

  const { isLoading, data } = useQuery({
    queryKey: ["getOwners", debounceFilters, page, rowsPerPage],
    queryFn: async () => getOwners(page, rowsPerPage),
  });

  const { owners = [], lastPageNumber } = data ?? {};

  const { action, quotaId } = React.useMemo(() => {
    const action = searchParams.get("action");
    const quotaId = searchParams.get("quotaId");

    return {
      action,
      quotaId,
    };
  }, [searchParams]);

  const handleChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const selectedOwner = React.useMemo(
    () => owners.find((owner) => owner.quotaId === Number(quotaId)),
    [owners, quotaId]
  );

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        {isLoading ? (
          <LoadingData />
        ) : owners.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <ListMyContracts owners={owners} />
              <Box alignSelf="flex-end" marginTop="8px">
                <PaginatedList
                  items={owners}
                  lastPageNumber={lastPageNumber ?? 1}
                  handleChangePage={handleChangePage}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={(value) => {
                    setRowsPerPage(value);
                    setPage(1);
                  }}
                />
              </Box>
            </Stack>
          </>
        )}
      </Stack>
      {match({ action, selectedOwner })
        .with(
          { action: "show", selectedOwner: P.not(undefined) },
          ({ selectedOwner }) => (
            <ShowDetailsModal shouldOpen={true} owner={selectedOwner} />
          )
        )
        .with(
          { action: "calendar", selectedOwner: P.not(undefined) },
          ({ selectedOwner }) => (
            <ModalSchedulingUser shouldOpen={true} owner={selectedOwner} />
          )
        )
        .otherwise(() => null)}
    </>
  );
}
