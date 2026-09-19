import { useMemo, useState } from "react";
import type { Appointment, AppointmentClient, Provider, Room, Treatment } from "@/features/appointments/types";
import { mockAppointments } from "@/features/appointments/mockData";

export interface RescheduleInput {
  appointmentId: string;
  startTime: string;
  endTime: string;
}

export interface CancelInput {
  appointmentId: string;
  reason: string;
  notes?: string;
}

export interface CreateAppointmentInput {
  client: AppointmentClient;
  treatment: Treatment;
  provider: Provider;
  room: Room;
  startTime: string;
  endTime: string;
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  function getById(id: string): Appointment | undefined {
    return appointments.find((a) => a.id === id);
  }

  function reschedule({ appointmentId, startTime, endTime }: RescheduleInput) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, startTime, endTime, status: "confirmed" as const } : a))
    );
  }

  function cancel({ appointmentId, reason, notes }: CancelInput) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, status: "cancelled" as const, cancellationReason: reason, cancellationNotes: notes } : a
      )
    );
  }

  function create(input: CreateAppointmentInput): Appointment {
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      client: input.client,
      treatment: input.treatment,
      provider: input.provider,
      room: input.room,
      startTime: input.startTime,
      endTime: input.endTime,
      status: "confirmed",
    };
    setAppointments((prev) =>
      [...prev, newAppointment].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    );
    return newAppointment;
  }

  const stats = useMemo(() => {
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const noShow = appointments.filter((a) => a.status === "no_show").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    return { total: appointments.length, confirmed, pending, noShow, cancelled };
  }, [appointments]);

  return { appointments, stats, getById, reschedule, cancel, create };
}
