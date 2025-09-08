"use client";

import { Owner } from "@/utils/types/multiownership/owners";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction as SetReservarStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

interface AddReservarProviderProps {
  children: ReactNode;
}

type ReservarContext = {
  reserva: {
    bookingId: string;
    appointmentId: string;
    initialDate: string;
    capacity: number;
    finalDate: string;
    idIntercambiadora: string;
    ownershipName: string;
    pessoaTitular1Tipo: string;
    documentOwnership: string;
    coteId: number;
    roomCondominiumId: number;
    hasSCPContract: boolean

  };
  owner: Owner;
  setOwner: Dispatch<Owner>;
  setReserva: Dispatch<
    SetReservarStateAction<{
      capacity: number;
      bookingId: string;
      appointmentId: string;
      initialDate: string;
      finalDate: string;
      idIntercambiadora: string;
      ownershipName: string;
      pessoaTitular1Tipo: string;
      documentOwnership: string;
      coteId: number;
      roomCondominiumId: number;
    hasSCPContract: boolean

    }>
  >;
};

export const ReservarContext = createContext<ReservarContext>(
  {} as ReservarContext
);

export function ReservarProvider({
  children,
}: Readonly<AddReservarProviderProps>): JSX.Element {
  const [reserva, setReserva] = useState({
    bookingId: "-1",
    appointmentId: "-1",
    capacity: 0,
    initialDate: "",
    finalDate: "",
    idIntercambiadora: "",
    ownershipName: "",
    pessoaTitular1Tipo: "",
    documentOwnership: "",
    coteId: -1,
    roomCondominiumId: -1,
    hasSCPContract: false
  });

  const [owner, setOwner] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedOwner = sessionStorage.getItem('owner');
      if (savedOwner) {
        try {
          return JSON.parse(savedOwner);
        } catch {
          return {} as Owner;
        }
      }
    }
    return {} as Owner;
  });

  const ownerMeno = useMemo(() => owner, [owner]);

  return (
    <ReservarContext.Provider
      value={{ setReserva, reserva, owner: ownerMeno, setOwner }}
    >
      {children}
    </ReservarContext.Provider>
  );
}

export function useReservar(): ReservarContext {
  const context = useContext(ReservarContext);
  return context;
}
