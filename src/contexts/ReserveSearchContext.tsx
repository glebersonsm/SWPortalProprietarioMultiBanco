"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AvailabilityItem } from '@/services/querys/user-time-sharing-availability';
import { UserContract } from '@/utils/types/user-time-sharing-contracts';

interface SearchFilters {
  startDate: string;
  endDate: string;
  selectedContract: string;
  selectedHotel: string;
  selectedContractDetails: UserContract | null;
}

interface ReserveSearchState {
  filters: SearchFilters;
  availabilityResults: AvailabilityItem[];
  hasSearched: boolean;
  isSearching: boolean;
  error: string | null;
}

interface ReserveSearchContextType {
  state: ReserveSearchState;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  updateAvailabilityResults: (results: AvailabilityItem[]) => void;
  setHasSearched: (hasSearched: boolean) => void;
  setIsSearching: (isSearching: boolean) => void;
  setError: (error: string | null) => void;
  clearState: () => void;
  saveStateToStorage: () => void;
  loadStateFromStorage: () => void;
}

const STORAGE_KEY = 'reserve_search_state';

const initialFilters: SearchFilters = {
  startDate: '',
  endDate: '',
  selectedContract: '',
  selectedHotel: '-1',
  selectedContractDetails: null,
};

const initialState: ReserveSearchState = {
  filters: initialFilters,
  availabilityResults: [],
  hasSearched: false,
  isSearching: false,
  error: null,
};

const ReserveSearchContext = createContext<ReserveSearchContextType | undefined>(undefined);

export const useReserveSearch = (): ReserveSearchContextType => {
  const context = useContext(ReserveSearchContext);
  if (context === undefined) {
    throw new Error('useReserveSearch must be used within a ReserveSearchProvider');
  }
  return context;
};

interface ReserveSearchProviderProps {
  children: ReactNode;
}

export const ReserveSearchProvider: React.FC<ReserveSearchProviderProps> = ({ children }) => {
  const [state, setState] = useState<ReserveSearchState>(initialState);

  const updateFilters = useCallback((filters: Partial<SearchFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const updateAvailabilityResults = useCallback((results: AvailabilityItem[]) => {
    setState(prev => ({ ...prev, availabilityResults: results }));
  }, []);

  const setHasSearched = useCallback((hasSearched: boolean) => {
    setState(prev => ({ ...prev, hasSearched }));
  }, []);

  const setIsSearching = useCallback((isSearching: boolean) => {
    setState(prev => ({ ...prev, isSearching }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const clearState = useCallback(() => {
    setState(initialState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveStateToStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Erro ao salvar estado no localStorage:', error);
      }
    }
  }, [state]);

  const loadStateFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setState(parsedState);
          return true;
        }
      } catch (error) {
        console.error('Erro ao carregar estado do localStorage:', error);
      }
    }
    return false;
  }, []);

  // Carregar estado do localStorage na inicialização
  useEffect(() => {
    loadStateFromStorage();
  }, [loadStateFromStorage]);

  // Salvar estado no localStorage sempre que ele mudar
  useEffect(() => {
    if (state.hasSearched || state.availabilityResults.length > 0) {
      saveStateToStorage();
    }
  }, [state, saveStateToStorage]);

  const contextValue: ReserveSearchContextType = {
    state,
    updateFilters,
    updateAvailabilityResults,
    setHasSearched,
    setIsSearching,
    setError,
    clearState,
    saveStateToStorage,
    loadStateFromStorage,
  };

  return (
    <ReserveSearchContext.Provider value={contextValue}>
      {children}
    </ReserveSearchContext.Provider>
  );
};