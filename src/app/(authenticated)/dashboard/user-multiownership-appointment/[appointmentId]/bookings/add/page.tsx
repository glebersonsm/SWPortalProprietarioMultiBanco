"use client";

import BookingForm from "../_components/BookingForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useReservar } from "../../../context.hook";

export default function AddBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const { reserva } = useReservar();
  const { appointmentId: appointmentId, initialDate: initialDate, finalDate: finalDate } = reserva

  if (!appointmentId || !initialDate || !finalDate) {
    const returnPath = from === "admin" 
      ? `/dashboard/user-multiownership-appointment/ListAppointmentsAdmView`
      : `/dashboard/user-multiownership-appointment/${appointmentId}/bookings`;
    router.push(returnPath);
  }

  return <BookingForm
    appointmentId={appointmentId?.toString()}
    initialDate={initialDate}
    finalDate={finalDate} />;
}
