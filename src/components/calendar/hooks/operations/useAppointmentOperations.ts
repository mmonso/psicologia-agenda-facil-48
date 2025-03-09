
import { toast } from "sonner";
import { createRecurringAppointments } from "../../utils";
import type { Appointment, Patient } from "../../utils";
import { AppointmentStatus } from "@/lib/data";

interface AppointmentOperationsProps {
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  selectedPatientId: string;
  appointmentNotes: string;
  isRecurring: boolean;
  selectedSlot: { day: Date; time: string } | null;
  resetDialogState: () => void;
}

export function useAppointmentOperations({
  appointments,
  setAppointments,
  patients,
  setPatients,
  selectedPatientId,
  appointmentNotes,
  isRecurring,
  selectedSlot,
  resetDialogState,
}: AppointmentOperationsProps) {
  const scheduleNewAppointment = () => {
    if (!selectedSlot || !selectedPatientId) {
      toast({
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
    
    if (isRecurring) {
      const recurringAppointments = createRecurringAppointments(newAppointment);
      newAppointments = [...newAppointments, ...recurringAppointments];
    }
    
    const updatedAppointments = [...appointments, ...newAppointments];
    setAppointments(updatedAppointments);
    
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
    
    toast({
      title: "Consulta agendada",
      description: `${patient.name} - ${new Date(selectedSlot.day).toLocaleDateString()} às ${selectedSlot.time}${isRecurring ? " (recorrente)" : ""}`,
    });
    
    resetDialogState();
  };

  const updateAppointment = (selectedAppointment: Appointment | null) => {
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
    
    toast({
      title: "Consulta atualizada",
      description: "Os detalhes da consulta foram atualizados com sucesso.",
    });
    
    resetDialogState();
  };

  const cancelAppointment = (selectedAppointment: Appointment | null) => {
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
    
    toast({
      title: "Consulta cancelada",
      description: "A consulta foi cancelada com sucesso.",
    });
    
    resetDialogState();
  };

  const completeAppointment = (selectedAppointment: Appointment | null) => {
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
    
    toast({
      title: "Consulta realizada",
      description: "A consulta foi marcada como realizada e paga.",
    });
    
    resetDialogState();
  };

  const markNoShow = (selectedAppointment: Appointment | null) => {
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
    
    toast({
      title: "Não compareceu",
      description: "O paciente foi marcado como não compareceu.",
    });
    
    resetDialogState();
  };

  return {
    scheduleNewAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    markNoShow,
  };
}
