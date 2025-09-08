"use client";

import { useState } from "react";
import { Divider, Stack } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import { AppointmentYearFilters } from "./_components/AppointmentYearFilters";
import { useQuery } from "@tanstack/react-query";
import { getOwners } from "@/services/querys/user-multiownership-contracts";
import { OwnerCards } from "./_components/ContractListAppointments";

export default function AppointmentsPage() {
  const [page, __] = useState(1);
  const [rowsPerPage, _] = useState(10);

  const { isLoading, data } = useQuery({
    queryKey: ["getOwners", page, rowsPerPage],
    queryFn: async () => getOwners(page, rowsPerPage),
  });

  const { owners = [] } = data ?? {};

  return (
    <>
      <Stack spacing={3} divider={<Divider />}>
        <AppointmentYearFilters />
        {isLoading ? (
          <LoadingData />
        ) : owners.length === 0 ? (
          <WithoutData />
        ) : (
          <>
            <Stack spacing={2}>
              <OwnerCards owners={owners} />
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
}
