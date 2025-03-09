
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCalendarPersistence } from "./state/useCalendarPersistence";
import { useWeekCalculation } from "./state/useWeekCalculation";
import type { CalendarState } from "../types/calendarTypes";
import type { Appointment, AvailableSlot, NewPatient, Patient } from "../utils";

export function useCalendarState(): CalendarState {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ day: Date, time: string } | null>(null);
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<NewPatient>({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const { toast } = useToast();
  
  // Use the week calculation hook
  const { weekStart, weekDays } = useWeekCalculation(currentDate);
  
  // Use the persistence hook
  useCalendarPersistence({
    availableSlots,
    setAvailableSlots,
    appointments,
    setAppointments,
    patients,
    setPatients
  });

  return {
    // State
    currentDate,
    setCurrentDate,
    availableSlots,
    setAvailableSlots,
    selectedSlot,
    setSelectedSlot,
    isNewPatientDialogOpen,
    setIsNewPatientDialogOpen,
    newPatient,
    setNewPatient,
    selectedPatientId,
    setSelectedPatientId,
    appointments,
    setAppointments,
    patients,
    setPatients,
    isRecurring,
    setIsRecurring,
    selectedAppointment,
    setSelectedAppointment,
    isEditMode,
    setIsEditMode,
    appointmentNotes,
    setAppointmentNotes,
    toast: { toast },
    
    // Derived state
    weekStart,
    weekDays,
  };
}
