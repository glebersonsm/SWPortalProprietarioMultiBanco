import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { initialFilters } from "./constants";
import { FiltersProps } from "@/utils/types/timeSharing/reserves";
import { getReserves } from "@/services/querys/timeSharing/reserves";

export const useGetReserves = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);

  const { isLoading, data } = useQuery({
    queryKey: ["getReserves", { page, filters }],
    queryFn: () =>
      getReserves({
        page,
        filters,
      }),
    enabled: isEnabled,
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
  };
};
