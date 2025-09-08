"use client";
import LoadingData from "@/components/LoadingData";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import ShowBookingsPage from "./_components/ShowBookings";
import { getAppointmentShowBookings } from "@/services/querys/multiownership/appointments";

export default function BookingsPage({
  params: { appointmentId },
}: {
  params: { appointmentId: string };
}) {
  const router = useRouter();

  const { isLoading, data, isError } = useQuery({
    queryKey: ["getAppointmentShowBookings", appointmentId],
    queryFn: () => getAppointmentShowBookings(appointmentId),
  });

  if (!isLoading && (isError || data === undefined)) {
    router.push(`/dashboard/multiownership/appointments`);
   }
  return isLoading ? (
    <LoadingData />
  ) : (
    <ShowBookingsPage bookings={data!} appointmentId={appointmentId} />
  );
}
