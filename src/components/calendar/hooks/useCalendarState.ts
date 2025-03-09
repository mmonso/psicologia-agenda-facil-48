
import { useState, useMemo, useEffect } from "react";
import { addDays, startOfWeek } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { patients as initialPatients, Patient as LibPatient } from "@/lib/data";
import { createRecurringAppointments } from "../utils";

import type { Appointment, AvailableSlot, NewPatient, Patient } from "../utils";

export type CalendarState = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  weekStart: Date;
  weekDays: Date[];
  availableSlots: AvailableSlot[];
  setAvailableSlots: (slots: AvailableSlot[]) => void;
  selectedSlot: { day: Date; time: string } | null;
  setSelectedSlot: (slot: { day: Date; time: string } | null) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  selectedPatientId: string;
  appointmentNotes: string;
  isRecurring: boolean;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  setSelectedPatientId: (id: string) => void;
  setIsRecurring: (isRecurring: boolean) => void;
  setAppointmentNotes: (notes: string) => void;
  toast: { toast: (props: { title: string; description: string }) => void };
  newPatient: NewPatient;
  setNewPatient: (patient: NewPatient) => void;
  setIsNewPatientDialogOpen: (open: boolean) => void;
  isNewPatientDialogOpen: boolean;
  isEditMode: boolean;
};

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
  
  const weekStart = useMemo(() => {
    // Use weekStartsOn: 0 for Sunday
    return startOfWeek(currentDate, { weekStartsOn: 0 });
  }, [currentDate]);
  
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => addDays(weekStart, index));
  }, [weekStart]);

  useEffect(() => {
    // Carregar slots disponíveis
    const savedSlots = localStorage.getItem('availableSlots');
    if (savedSlots) {
      try {
        setAvailableSlots(JSON.parse(savedSlots));
      } catch (e) {
        console.error('Erro ao carregar horários disponíveis:', e);
      }
    }
    
    // Carregar consultas
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (e) {
        console.error('Erro ao carregar consultas:', e);
      }
    } else {
      setAppointments([]); // Inicia com consultas vazias
    }

    // Carregar pacientes
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (e) {
        console.error('Erro ao carregar pacientes:', e);
        // Usa os pacientes iniciais como fallback
        setPatients(initialPatients.map(p => ({
          ...p,
          startDate: p.startDate instanceof Date ? p.startDate : new Date(p.startDate)
        })));
      }
    } else {
      // Converter os pacientes iniciais para o formato correto
      setPatients(initialPatients.map(p => ({
        ...p,
        startDate: p.startDate instanceof Date ? p.startDate : new Date(p.startDate)
      })));
    }
  }, []);

  // Salvar slots disponíveis quando mudarem
  useEffect(() => {
    localStorage.setItem('availableSlots', JSON.stringify(availableSlots));
  }, [availableSlots]);
  
  // Salvar consultas quando mudarem
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Salvar pacientes quando mudarem
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

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
