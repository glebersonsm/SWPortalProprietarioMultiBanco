"use client";
import LoadingData from "@/components/LoadingData";
import { getUserAppointmentShowBookings } from "@/services/querys/user-multiownership-appointments";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import ShowBookingsPage from "./_components/ShowBookings";

export default function BookingsPage({
  params: { appointmentId },
  searchParams,
}: {
  params: { appointmentId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const from = searchParams?.from;

  const { isLoading, data, isError } = useQuery({
    queryKey: ["getUserAppointmentShowBookings", appointmentId],
    queryFn: () => getUserAppointmentShowBookings(appointmentId),
  });

  if ((isError)) {
    toast.error(
      "Não foi possível acessar os dados do agendamento nesse momento!"
    );
    const returnPath = from === "admin" 
      ? `/dashboard/user-multiownership-appointment/ListAppointmentsAdmView`
      : `/dashboard`;
    router.push(returnPath);
  }
  return isLoading ? (
    <LoadingData />
  ) : (
    <ShowBookingsPage bookings={data!} appointmentId={appointmentId} />
  );
}
