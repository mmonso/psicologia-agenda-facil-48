
import type { Appointment, AvailableSlot, NewPatient, Patient } from "../utils";

export interface CalendarState {
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
  toast: { toast: (props: { description: string }) => void };
  newPatient: NewPatient;
  setNewPatient: (patient: NewPatient) => void;
  setIsNewPatientDialogOpen: (open: boolean) => void;
  isNewPatientDialogOpen: boolean;
  isEditMode: boolean;
}
