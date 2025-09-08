import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getTransactions } from "@/services/querys/finance";
import { initialFilters } from "./constants";
import { FiltersTransactions } from "@/utils/types/finance";

const PAGE_STORAGE_KEY = "transations_page";
const ROWS_PER_PAGE_STORAGE_KEY = "transactions_rows_per_page";
const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export const useGetTransactions = () => {
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
    queryKey: ["getTransactions", { filters, page, rowsPerPage }],
    queryFn: () =>
      getTransactions({
        filters,
        page,
        rowsPerPage,
      }),
    enabled: isEnabled,
  });

  const handlePageChange = (page: number) => {
    setPage(page);

    if (!isEnabled) {
      setIsEnabled(true);
    }
  };

  const handleFiltersChange = (filters: FiltersTransactions) => {
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
