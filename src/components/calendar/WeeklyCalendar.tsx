import { useState, useMemo, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { patients, AppointmentStatus } from "@/lib/data";
import { TIME_SLOTS, getStatusDetails, createRecurringAppointments } from "./utils";
import AppointmentDialog from "./AppointmentDialog";
import EditAppointmentDialog from "./EditAppointmentDialog";
import NewPatientDialog from "./NewPatientDialog";
import CalendarHeader from "./CalendarHeader";
import TimeSlots from "./TimeSlots";

import type { Appointment, AvailableSlot, NewPatient } from "./utils";

export default function WeeklyCalendar() {
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
    return startOfWeek(currentDate, { weekStartsOn: 1 });
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
    const dayOfWeek = day.getDay() === 0 ? 6 : day.getDay() - 1; // Converter para 0-6 (seg-dom)
    return availableSlots.some(slot => slot.day === dayOfWeek && slot.time === timeSlot);
  };

  const addSlotAvailability = (day: Date, timeSlot: string) => {
    const dayOfWeek = day.getDay() === 0 ? 6 : day.getDay() - 1; // Converter para 0-6 (seg-dom)
    
    setAvailableSlots(prevSlots => [
      ...prevSlots,
      { day: dayOfWeek, time: timeSlot }
    ]);
    
    toast({
      title: "Horário disponibilizado",
      description: `${format(day, "EEEE", { locale: ptBR })} às ${timeSlot} agora está disponível para consultas.`,
    });
  };
  
  const removeSlotAvailability = (day: Date, timeSlot: string) => {
    const dayOfWeek = day.getDay() === 0 ? 6 : day.getDay() - 1; // Converter para 0-6 (seg-dom)
    
    setAvailableSlots(prevSlots => 
      prevSlots.filter(
        slot => !(slot.day === dayOfWeek && slot.time === timeSlot)
      )
    );
    
    toast({
      title: "Horário removido",
      description: `${format(day, "EEEE", { locale: ptBR })} às ${timeSlot} não está mais disponível.`,
    });

    setSelectedSlot(null);
  };

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
    
    // If recurring, create additional appointments
    if (isRecurring) {
      const recurringAppointments = createRecurringAppointments(newAppointment);
      newAppointments = [...newAppointments, ...recurringAppointments];
    }
    
    setAppointments(prev => [...prev, ...newAppointments]);
    
    // Remove the slot from available slots since it's now booked
    removeSlotAvailability(selectedSlot.day, selectedSlot.time);
    
    toast({
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
    
    toast({
      title: "Horário reservado",
      description: `${format(selectedSlot.day, "EEEE", { locale: ptBR })} às ${selectedSlot.time} foi reservado.`,
    });
    
    resetDialogState();
  };
  
  const openNewPatientDialog = () => {
    setIsNewPatientDialogOpen(true);
  };

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveNewPatient = () => {
    // In a real app, we would save this to the database
    // For now we'll just show a toast and close the dialog
    toast({
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
    
    toast({
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
    
    toast({
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
    
    toast({
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
    
    toast({
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

  return (
    <Card className="hover-card-effect">
      <CardHeader>
        <CalendarHeader 
          weekDays={weekDays}
          weekStart={weekStart}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onCurrentWeek={goToCurrentWeek}
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <TimeSlots 
              timeSlots={TIME_SLOTS}
              weekDays={weekDays}
              appointments={appointments}
              isSlotAvailable={isSlotAvailable}
              onSelectSlot={(day, timeSlot) => setSelectedSlot({ day, time: timeSlot })}
              onAddAvailability={addSlotAvailability}
              onSelectAppointment={handleAppointmentClick}
              getStatusDetails={getStatusDetails}
            />
          </div>
        </div>
      </CardContent>

      {/* Dialog for scheduling an appointment */}
      <AppointmentDialog 
        open={!!selectedSlot && !isEditMode}
        selectedSlot={selectedSlot}
        onClose={resetDialogState}
        onScheduleAppointment={scheduleNewAppointment}
        onReserveTimeSlot={reserveTimeSlot}
        onOpenNewPatientDialog={openNewPatientDialog}
        onRemoveAvailability={() => selectedSlot && removeSlotAvailability(selectedSlot.day, selectedSlot.time)}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        appointmentNotes={appointmentNotes}
        setAppointmentNotes={setAppointmentNotes}
      />

      {/* Dialog for editing an appointment */}
      <EditAppointmentDialog 
        open={isEditMode && !!selectedAppointment}
        selectedAppointment={selectedAppointment}
        onClose={resetDialogState}
        onUpdateAppointment={updateAppointment}
        onCompleteAppointment={completeAppointment}
        onCancelAppointment={cancelAppointment}
        onMarkNoShow={markNoShow}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        appointmentNotes={appointmentNotes}
        setAppointmentNotes={setAppointmentNotes}
      />

      {/* Dialog for adding a new patient */}
      <NewPatientDialog 
        open={isNewPatientDialogOpen}
        onClose={() => setIsNewPatientDialogOpen(false)}
        onSave={saveNewPatient}
        newPatient={newPatient}
        onChange={handleNewPatientChange}
      />
    </Card>
  );
}
