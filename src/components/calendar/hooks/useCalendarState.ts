
import { useState, useMemo, useEffect } from "react";
import { addDays, startOfWeek } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { patients } from "@/lib/data";
import { createRecurringAppointments } from "../utils";

import type { Appointment, AvailableSlot, NewPatient } from "../utils";

export function useCalendarState() {
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
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const { toast } = useToast();
  
  const weekStart = useMemo(() => {
    // Use weekStartsOn: 0 for Sunday
    return startOfWeek(currentDate, { weekStartsOn: 0 });
  }, [currentDate]);
  
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => addDays(weekStart, index));
  }, [weekStart]);

  useEffect(() => {
    const savedSlots = localStorage.getItem('availableSlots');
    if (savedSlots) {
      try {
        setAvailableSlots(JSON.parse(savedSlots));
      } catch (e) {
        console.error('Erro ao carregar horários disponíveis:', e);
      }
    }
    
    // Load saved appointments
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (e) {
        console.error('Erro ao carregar consultas:', e);
      }
    } else {
      setAppointments([]); // Start with empty appointments
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('availableSlots', JSON.stringify(availableSlots));
  }, [availableSlots]);
  
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

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
    isRecurring,
    setIsRecurring,
    selectedAppointment,
    setSelectedAppointment,
    isEditMode,
    setIsEditMode,
    appointmentNotes,
    setAppointmentNotes,
    toast,
    
    // Derived state
    weekStart,
    weekDays,
  };
}
