
import type { Appointment } from "../utils";
import type { CalendarState } from "../types/calendarTypes";
import { useNavigationOperations } from "./operations/useNavigationOperations";
import { useAvailabilityOperations } from "./operations/useAvailabilityOperations";
import { useAppointmentOperations } from "./operations/useAppointmentOperations";
import { usePatientOperations } from "./operations/usePatientOperations";

export function useCalendarOperations(state: CalendarState) {
  const {
    currentDate,
    setCurrentDate,
    weekStart,
    availableSlots,
    setAvailableSlots,
    selectedSlot,
    setSelectedSlot,
    appointments,
    setAppointments,
    patients,
    setPatients,
    selectedPatientId,
    appointmentNotes,
    isRecurring,
    selectedAppointment,
    setSelectedAppointment,
    setIsEditMode,
    setSelectedPatientId,
    setIsRecurring,
    setAppointmentNotes,
    newPatient,
    setNewPatient,
    setIsNewPatientDialogOpen,
  } = state;

  const navigation = useNavigationOperations({
    weekStart,
    setCurrentDate,
  });

  const availability = useAvailabilityOperations({
    availableSlots,
    setAvailableSlots,
    setSelectedSlot,
  });

  const resetDialogState = () => {
    setSelectedAppointment(null);
    setIsEditMode(false);
    setSelectedPatientId("");
    setIsRecurring(false);
    setAppointmentNotes("");
    setSelectedSlot(null);
  };

  const appointment = useAppointmentOperations({
    appointments,
    setAppointments,
    patients,
    setPatients,
    selectedPatientId,
    appointmentNotes,
    isRecurring,
    selectedSlot,
    resetDialogState,
  });

  const patient = usePatientOperations(
    patients,
    setPatients,
    setNewPatient,
    setIsNewPatientDialogOpen,
    setSelectedPatientId,
  );

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditMode(true);
    setSelectedPatientId(appointment.patientId);
    setIsRecurring(appointment.isRecurring || false);
    setAppointmentNotes(appointment.notes);
  };

  return {
    ...navigation,
    ...availability,
    ...appointment,
    saveNewPatient: patient.saveNewPatient,
    handleAppointmentClick,
    resetDialogState,
  };
}
