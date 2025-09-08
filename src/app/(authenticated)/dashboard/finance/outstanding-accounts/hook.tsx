import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getOutstandingBills } from "@/services/querys/finance";
import { initialFilters } from "./constants";
import { FiltersOutstandingBills } from "@/utils/types/finance";

const PAGE_STORAGE_KEY = "outstandingBills_page";
const ROWS_PER_PAGE_STORAGE_KEY = "outstandingBills_rows_per_page";
const thereIsLocalStorage = typeof window !== "undefined" && window.localStorage;

export const useGetOutSandingAccounts = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(() => {
    if (thereIsLocalStorage) {
      return Number(localStorage.getItem(PAGE_STORAGE_KEY)) || 1;
    }
    return 1;
  });
  
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (thereIsLocalStorage) {
      return Number(localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY)) || 10;
    }
    return 10;
  });

  const { isLoading, data } = useQuery({
    queryKey: ["getOutstandingBills", { filters, page, rowsPerPage }],
    queryFn: () =>
      getOutstandingBills({
        filters,
        page,
        rowsPerPage,
      }),
    enabled: isEnabled,
  });

  useEffect(() => {
    if (thereIsLocalStorage)
        localStorage.setItem(PAGE_STORAGE_KEY, page.toString());
  }, [page]);

  useEffect(() => {
    if (thereIsLocalStorage)
    localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, rowsPerPage.toString());
  }, [rowsPerPage]);

  const handlePageChange = (page: number) => {
    setPage(page);

    if (!isEnabled) {
      setIsEnabled(true);
    }
  };

  const handleFiltersChange = (filters: FiltersOutstandingBills) => {
    setFilters(filters);

    if (!isEnabled) {
      setIsEnabled(true);
    }
  };

  return {
    data,
    page,
    isLoading,
    rowsPerPage,
    setRowsPerPage,
    handleFiltersChange,
    handlePageChange
  };
};
