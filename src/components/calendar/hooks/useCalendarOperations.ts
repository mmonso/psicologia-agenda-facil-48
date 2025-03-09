
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { addDays } from "date-fns";
import { createRecurringAppointments } from "../utils";
import type { Appointment, AvailableSlot, Patient } from "../utils";
import { AppointmentStatus } from "@/lib/data";

import type { CalendarState } from "./useCalendarState";

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
    
    setAvailableSlots((prevSlots: AvailableSlot[]) => [
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
    
    setAvailableSlots((prevSlots: AvailableSlot[]) => 
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

  const saveNewPatient = () => {
    if (!newPatient.name.trim()) {
      toast.toast({
        title: "Erro",
        description: "Nome do paciente é obrigatório",
      });
      return;
    }

    // Criar novo paciente
    const newPatientData: Patient = {
      id: `patient-${Date.now()}`,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      status: "active",
      startDate: new Date(),
      totalSessions: 0,
      nextAppointment: null,
      notes: newPatient.notes,
    };

    // Adicionar à lista de pacientes centralizados
    setPatients((prevPatients: Patient[]) => [...prevPatients, newPatientData]);
    
    // Resetar o formulário
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      notes: ""
    });
    
    // Fechar diálogo
    setIsNewPatientDialogOpen(false);
    
    // Notificar usuário
    toast.toast({
      title: "Paciente adicionado",
      description: `${newPatientData.name} foi adicionado com sucesso.`,
    });
    
    // Selecionar automaticamente o novo paciente
    setSelectedPatientId(newPatientData.id);
  };

  const scheduleNewAppointment = () => {
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
    
    setAppointments((prev: Appointment[]) => [...prev, ...newAppointments]);
    
    // Atualizar nextAppointment do paciente
    const updatedPatients = patients.map(p => {
      if (p.id === patient.id) {
        return {
          ...p,
          nextAppointment: appointmentDate,
          totalSessions: p.totalSessions + 1
        };
      }
      return p;
    });
    setPatients(updatedPatients);
    
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
    
    setAppointments((prev: Appointment[]) => [...prev, newAppointment]);
    
    // Remove the slot from available slots
    removeSlotAvailability(selectedSlot.day, selectedSlot.time);
    
    toast.toast({
      title: "Horário reservado",
      description: `${format(selectedSlot.day, "EEEE", { locale: ptBR })} às ${selectedSlot.time} foi reservado.`,
    });
    
    resetDialogState();
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
    
    const patient = patients.find(p => p.id === selectedPatientId);
    
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === selectedAppointment.id) {
        return {
          ...appointment,
          patientId: selectedPatientId || appointment.patientId,
          patientName: patient?.name || appointment.patientName,
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
    
    // Atualizar o número total de sessões do paciente
    if (selectedAppointment.patientId !== "reserved") {
      const updatedPatients = patients.map(p => {
        if (p.id === selectedAppointment.patientId) {
          return {
            ...p,
            totalSessions: p.totalSessions + 1
          };
        }
        return p;
      });
      setPatients(updatedPatients);
    }
    
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
