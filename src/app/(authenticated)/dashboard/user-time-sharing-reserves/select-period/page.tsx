"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import BookingForm from "./_components/BookingForm";
import LoadingData from "@/components/LoadingData";

export default function SelectPeriodPage() {
  const searchParams = useSearchParams();
  
  console.log('SelectPeriodPage - Parâmetros da URL:', {
    availability: searchParams.get("availability"),
    editMode: searchParams.get("editMode"),
    reserveData: searchParams.get("reserveData")
  });
  
  // Recuperar dados da disponibilidade dos parâmetros da URL
  const availabilityData = searchParams.get("availability");
  const editMode = searchParams.get("editMode") === 'true';
  const reserveDataParam = searchParams.get("reserveData");
  
  if (!availabilityData) {
    console.error('SelectPeriodPage - Dados de disponibilidade não encontrados');
    return <LoadingData />;
  }
  
  let availability: any;
  let reserveData: any = null;
  
  try {
    console.log('SelectPeriodPage - Parseando dados de disponibilidade...');
    availability = JSON.parse(decodeURIComponent(availabilityData));
    console.log('SelectPeriodPage - Availability parseado:', availability);
    
    // Validar se o objeto tem as propriedades necessárias
    if (!availability || typeof availability !== 'object') {
      console.error("SelectPeriodPage - Dados de disponibilidade inválidos:", availability);
      return <LoadingData />;
    }
    
    // Validar propriedades essenciais
    const requiredProps = ['nomeHotel', 'checkin', 'checkout'];
    const missingProps = requiredProps.filter(prop => !availability[prop]);
    
    if (missingProps.length > 0) {
      console.error('SelectPeriodPage - Propriedades essenciais faltando:', missingProps);
      return <LoadingData />;
    }
    
    // Se estiver em modo de edição, parsear os dados da reserva
    if (editMode && reserveDataParam) {
      console.log('SelectPeriodPage - Parseando dados da reserva para edição...');
      reserveData = JSON.parse(decodeURIComponent(reserveDataParam));
      console.log('SelectPeriodPage - ReserveData parseado:', reserveData);
      
      // Validar dados da reserva
      if (!reserveData || !reserveData.hospedes) {
        console.error('SelectPeriodPage - Dados da reserva inválidos:', reserveData);
        return <LoadingData />;
      }
    }
  } catch (error) {
    console.error("SelectPeriodPage - Erro ao parsear dados:", error);
    return <LoadingData />;
  }
  
  return (
    <BookingForm 
      availability={availability}
      editMode={editMode}
      reserveData={reserveData}
    />
  );
}