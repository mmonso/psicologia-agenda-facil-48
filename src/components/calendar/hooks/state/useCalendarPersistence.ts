
import { useEffect } from "react";
import { patients as initialPatients } from "@/lib/data";
import type { Appointment, AvailableSlot, Patient } from "../../utils";

interface CalendarPersistenceProps {
  availableSlots: AvailableSlot[];
  setAvailableSlots: (slots: AvailableSlot[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
}

export function useCalendarPersistence({
  availableSlots,
  setAvailableSlots,
  appointments,
  setAppointments,
  patients,
  setPatients
}: CalendarPersistenceProps) {
  
  // Load data from localStorage on component mount
  useEffect(() => {
    // Load available slots
    const savedSlots = localStorage.getItem('availableSlots');
    if (savedSlots) {
      try {
        setAvailableSlots(JSON.parse(savedSlots));
      } catch (e) {
        console.error('Erro ao carregar horários disponíveis:', e);
      }
    }
    
    // Load appointments
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (e) {
        console.error('Erro ao carregar consultas:', e);
      }
    } else {
      setAppointments([]); // Initialize with empty appointments
    }

    // Load patients
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (e) {
        console.error('Erro ao carregar pacientes:', e);
        // Use initial patients as fallback
        setPatients(initialPatients.map(p => ({
          ...p,
          startDate: p.startDate instanceof Date ? p.startDate : new Date(p.startDate)
        })));
      }
    } else {
      // Convert initial patients to correct format
      setPatients(initialPatients.map(p => ({
        ...p,
        startDate: p.startDate instanceof Date ? p.startDate : new Date(p.startDate)
      })));
    }
  }, [setAvailableSlots, setAppointments, setPatients]);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('availableSlots', JSON.stringify(availableSlots));
  }, [availableSlots]);
  
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);
}
