import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { addDays } from "date-fns";
import { createRecurringAppointments } from "../utils";
import type { Appointment, AppointmentStatus } from "../utils";

import type { Toast } from "@/hooks/use-toast";

type CalendarState = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  weekStart: Date;
  weekDays: Date[];
  availableSlots: { day: number; time: string }[];
  setAvailableSlots: (slots: { day: number; time: string }[]) => void;
  selectedSlot: { day: Date; time: string } | null;
  setSelectedSlot: (slot: { day: Date; time: string } | null) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  selectedPatientId: string;
  appointmentNotes: string;
  isRecurring: boolean;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  setSelectedPatientId: (id: string) => void;
  setIsRecurring: (isRecurring: boolean) => void;
  setAppointmentNotes: (notes: string) => void;
  toast: {
    toast: (props: { title: string; description: string }) => void;
  };
  newPatient: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  setNewPatient: (patient: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  }) => void;
  setIsNewPatientDialogOpen: (open: boolean) => void;
};

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
    selectedPatientId,
    appointmentNotes,
    isRecurring,
    selectedAppointment,
    setSelectedAppointment,
    setIsEditMode,
    setSelectedPatientId,
    setIsRecurring,
    setAppointmentNotes,
    toast,
    newPatient,
    setNewPatient,
    setIsNewPatientDialogOpen,
  } = state;

  const goToPreviousWeek = () => {
    setCurrentDate(addDays(weekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(weekStart, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  const isSlotAvailable = (day: Date, timeSlot: string) => {
    // Using Sunday as first day (0-6, Sun-Sat)
    const dayOfWeek = day.getDay();
    return availableSlots.some(slot => slot.day === dayOfWeek && slot.time === timeSlot);
  };

  const addSlotAvailability = (day: Date, timeSlot: string) => {
    // Using Sunday as first day (0-6, Sun-Sat)
    const dayOfWeek = day.getDay();
    
    setAvailableSlots(prevSlots => [
      ...prevSlots,
      { day: dayOfWeek, time: timeSlot }
    ]);
    
    toast.toast({
      title: "Horário disponibilizado",
      description: `${format(day, "EEEE", { locale: ptBR })} às ${timeSlot} agora está disponível para consultas.`,
    });
  };
  
  const removeSlotAvailability = (day: Date, timeSlot: string) => {
    // Using Sunday as first day (0-6, Sun-Sat)
    const dayOfWeek = day.getDay();
    
    setAvailableSlots(prevSlots => 
      prevSlots.filter(
        slot => !(slot.day === dayOfWeek && slot.time === timeSlot)
      )
    );
    
    toast.toast({
      title: "Horário removido",
      description: `${format(day, "EEEE", { locale: ptBR })} às ${timeSlot} não está mais disponível.`,
    });

    setSelectedSlot(null);
  };

  const scheduleNewAppointment = (patients: any[]) => {
    if (!selectedSlot || !selectedPatientId) {
      toast.toast({
        title: "Atenção",
        description: "Selecione um paciente para agendar a consulta.",
      });
      return;
    }
    
    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;
    
    const appointmentDate = new Date(selectedSlot.day);
    appointmentDate.setHours(
      Number(selectedSlot.time.split(':')[0]),
      Number(selectedSlot.time.split(':')[1])
    );
    
    const newAppointment = {
      id: `a${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      date: appointmentDate,
      duration: 50,
      status: "scheduled" as AppointmentStatus,
      notes: appointmentNotes,
      paid: false,
      isRecurring: isRecurring
    };
    
    let newAppointments = [newAppointment];
    
    // If recurring, create additional appointments
    if (isRecurring) {
      const recurringAppointments = createRecurringAppointments(newAppointment);
      newAppointments = [...newAppointments, ...recurringAppointments];
    }
    
    setAppointments(prev => [...prev, ...newAppointments]);
    
    // Remove the slot from available slots since it's now booked
    removeSlotAvailability(selectedSlot.day, selectedSlot.time);
    
    toast.toast({
      title: "Consulta agendada",
      description: `${patient.name} - ${format(selectedSlot.day, "EEEE", { locale: ptBR })} às ${selectedSlot.time}${isRecurring ? " (recorrente)" : ""}`,
    });
    
    resetDialogState();
  };
  
  const reserveTimeSlot = () => {
    if (!selectedSlot) return;
    
    const appointmentDate = new Date(selectedSlot.day);
    appointmentDate.setHours(
      Number(selectedSlot.time.split(':')[0]),
      Number(selectedSlot.time.split(':')[1])
    );
    
    // Create a reserved appointment without a patient
    const newAppointment = {
      id: `reserved-${Date.now()}`,
      patientId: "reserved",
      patientName: "Horário Reservado",
      date: appointmentDate,
      duration: 50,
      status: "scheduled" as AppointmentStatus,
      notes: "Horário reservado",
      paid: false
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    
    // Remove the slot from available slots
    removeSlotAvailability(selectedSlot.day, selectedSlot.time);
    
    toast.toast({
      title: "Horário reservado",
      description: `${format(selectedSlot.day, "EEEE", { locale: ptBR })} às ${selectedSlot.time} foi reservado.`,
    });
    
    resetDialogState();
  };
  
  const saveNewPatient = () => {
    // In a real app, we would save this to the database
    // For now we'll just show a toast and close the dialog
    toast.toast({
      title: "Paciente adicionado",
      description: `${newPatient.name} foi adicionado com sucesso.`,
    });
    
    // Reset the form
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      notes: ""
    });
    
    // Close new patient dialog and keep appointment dialog open
    setIsNewPatientDialogOpen(false);
  };
  
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditMode(true);
    setSelectedPatientId(appointment.patientId);
    setIsRecurring(appointment.isRecurring || false);
    setAppointmentNotes(appointment.notes);
  };
  
  const updateAppointment = () => {
    if (!selectedAppointment) return;
    
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === selectedAppointment.id) {
        return {
          ...appointment,
          patientId: selectedPatientId || appointment.patientId,
          patientName: patients.find(p => p.id === selectedPatientId)?.name || appointment.patientName,
          notes: appointmentNotes,
          isRecurring: isRecurring
        };
      }
      return appointment;
    });
    
    setAppointments(updatedAppointments);
    
    toast.toast({
      title: "Consulta atualizada",
      description: "Os detalhes da consulta foram atualizados com sucesso.",
    });
    
    resetDialogState();
  };
  
  const cancelAppointment = () => {
    if (!selectedAppointment) return;
    
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === selectedAppointment.id) {
        return {
          ...appointment,
          status: "canceled" as AppointmentStatus
        };
      }
      return appointment;
    });
    
    setAppointments(updatedAppointments);
    
    toast.toast({
      title: "Consulta cancelada",
      description: "A consulta foi cancelada com sucesso.",
    });
    
    resetDialogState();
  };
  
  const completeAppointment = () => {
    if (!selectedAppointment) return;
    
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === selectedAppointment.id) {
        return {
          ...appointment,
          status: "completed" as AppointmentStatus,
          paid: true
        };
      }
      return appointment;
    });
    
    setAppointments(updatedAppointments);
    
    toast.toast({
      title: "Consulta realizada",
      description: "A consulta foi marcada como realizada e paga.",
    });
    
    resetDialogState();
  };
  
  const markNoShow = () => {
    if (!selectedAppointment) return;
    
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === selectedAppointment.id) {
        return {
          ...appointment,
          status: "no-show" as AppointmentStatus
        };
      }
      return appointment;
    });
    
    setAppointments(updatedAppointments);
    
    toast.toast({
      title: "Não compareceu",
      description: "O paciente foi marcado como não compareceu.",
    });
    
    resetDialogState();
  };
  
  const resetDialogState = () => {
    setSelectedAppointment(null);
    setIsEditMode(false);
    setSelectedPatientId("");
    setIsRecurring(false);
    setAppointmentNotes("");
    setSelectedSlot(null);
  };

  return {
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isSlotAvailable,
    addSlotAvailability,
    removeSlotAvailability,
    scheduleNewAppointment,
    reserveTimeSlot,
    saveNewPatient,
    handleAppointmentClick,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    markNoShow,
    resetDialogState,
  };
}
