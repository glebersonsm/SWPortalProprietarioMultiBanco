"use client"

import React, { createContext, useContext, useState } from "react";
import { FiltersProps } from "@/utils/types/user-reservesMultiOwnership";
import { initialFilters } from "./constants";

type FiltersContextType = {
  filters: FiltersProps;
  years: number[];
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
};

const FiltersContext = createContext<FiltersContextType>({} as FiltersContextType);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<FiltersProps>({
    ...initialFilters,
    year: String(currentYear),
  });

  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <FiltersContext.Provider value={{ filters, setFilters, years }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  return context;
};