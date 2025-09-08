"use client";
import LoadingData from "@/components/LoadingData";
import { getAppointmentBookingById } from "@/services/querys/user-multiownership-appointments";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import BookingForm from "../../_components/BookingForm";
import { useRouter, useSearchParams } from "next/navigation";


export default function EditBookingPage({
  params: { appointmentId, bookingId, },
}: {
  params: { appointmentId: string; bookingId: string; };
}) {
  const router = useRouter();

  const searchparams = useSearchParams();
  const initialDate = searchparams.get("initialdate") || "";
  const finalDate = searchparams.get("finaldate") || "";

  const { isLoading, data, isError } = useQuery({
    queryKey: ["getAppointmentBookingById", bookingId],
    queryFn: () => getAppointmentBookingById(bookingId),
  });

  if (isError) {
    router.push(
      `/dashboard/user-multiownership-appointment/${appointmentId}/bookings`
    );
  }

  return isLoading ? (
    <LoadingData />
  ) : (
    <BookingForm 
      booking={data} 
      appointmentId={appointmentId} 
      initialDate={initialDate} 
      finalDate={finalDate ?? new Date(new Date(initialDate).setDate(new Date(initialDate).getDate() + 7)).toISOString()} 
      isEditing 
    />
  );
}