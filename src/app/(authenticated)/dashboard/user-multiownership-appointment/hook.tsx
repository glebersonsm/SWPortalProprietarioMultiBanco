import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FiltersProps } from "@/utils/types/user-reservesMultiOwnership";
import { getUserAppointmentsMultiOwnership } from "@/services/querys/user-multiownership-appointments";
import { useFilters } from "./Filters.context.hook";
import { useReservar } from "./context.hook";

const PAGE_STORAGE_KEY = "users_multiownership_appointment_page";
const ROWS_PER_PAGE_STORAGE_KEY =
  "users_multiownership_appointment_rows_per_page";

  const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export const useGetAppointments = () => {
    const { owner } = useReservar();
  
  const [isEnabled, setIsEnabled] = useState(false);

  const { filters, setFilters } = useFilters();

  const [page, setPage] = useState(() => {
    return thereIsLocalStorage ? Number(localStorage.getItem(PAGE_STORAGE_KEY)) || 1 : 1;
  });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    return thereIsLocalStorage ? Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY)) || 15 : 15;
  });

  useEffect(() => {
    if (thereIsLocalStorage)
      localStorage.setItem(PAGE_STORAGE_KEY, page.toString());
  }, [page]);

  useEffect(() => {
    if (thereIsLocalStorage)
      localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, rowsPerPage.toString());
  }, [rowsPerPage]);

  const { isLoading, data } = useQuery({
    queryKey: [
      "getUserAppointmentsMultiOwnership",
      { page, filters, rowsPerPage, cotaAcId: owner?.quotaId },
    ],
    queryFn: () =>
      getUserAppointmentsMultiOwnership({
        page,
        filters,
        rowsPerPage,
        cotaAcId: owner.quotaId
      }),
    enabled: !!owner?.quotaId, // Só executa a query quando o owner estiver disponível
  });

  const handlePageChange = (page: number) => {
    setPage(page);

    if (!isEnabled) {
      setIsEnabled(true);
    }
  };

  const handleFiltersChange = (filters: FiltersProps) => {
    setFilters(filters);

    if (!isEnabled) {
      setIsEnabled(true);
    }
  };

  return {
    data,
    page,
    isLoading,
    handleFiltersChange,
    handlePageChange,
    rowsPerPage,
    setRowsPerPage,
  };
};
