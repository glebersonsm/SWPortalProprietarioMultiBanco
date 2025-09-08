import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { initialFilters } from "./constants";
import { getAppointmentsMultiOwnership } from "@/services/querys/multiownership/appointments";
import { FiltersProps } from "@/utils/types/multiownership/appointments";

const PAGE_STORAGE_KEY = "appointments_page";
const ROWS_PER_PAGE_STORAGE_KEY = "appointments_rows_per_page";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export const useGetAppointments = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(() => {
    if (thereIsLocalStorage)
      return Number(localStorage.getItem(PAGE_STORAGE_KEY)) || 1;
    else return 1;
  });
  
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (thereIsLocalStorage)
      return Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY)) || 10;
    else return 10;
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
    queryKey: ["getAppointmentsMultiOwnership", { filters, page, rowsPerPage }],
    queryFn: () =>
      getAppointmentsMultiOwnership({
        filters,
        page,
        rowsPerPage,
      }),
    enabled: isEnabled,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (!isEnabled) {
      setIsEnabled(true);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Resetando para a primeira página ao alterar o número de linhas
    if (!isEnabled) {
      setIsEnabled(true);
    }
  };

  const handleFiltersChange = (newFilters: FiltersProps) => {
    setFilters(newFilters);
    if (!isEnabled) {
      setIsEnabled(true);
    }
  };

  return {
    data,
    page,
    rowsPerPage,
    isLoading,
    setRowsPerPage: handleRowsPerPageChange,
    handleFiltersChange,
    handlePageChange,
  };
};
