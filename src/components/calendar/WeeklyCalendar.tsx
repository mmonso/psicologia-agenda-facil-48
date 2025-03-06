import { useState, useMemo, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Calendar, X, UserPlus, Clock, Edit, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { appointments as mockAppointments, patients, AppointmentStatus } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

interface AvailableSlot {
  day: number; // 0-6 (segunda a domingo)
  time: string; // formato "HH:MM"
}

interface NewPatient {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  duration: number;
  status: AppointmentStatus;
  notes: string;
  paid: boolean;
  isRecurring?: boolean;
}

const getStatusDetails = (status: AppointmentStatus) => {
  switch (status) {
    case "scheduled":
      return {
        label: "Agendada",
        variant: "default" as const,
        className: "bg-primary",
      };
    case "completed":
      return {
        label: "Realizada",
        variant: "outline" as const,
        className: "bg-green-500",
      };
    case "canceled":
      return {
        label: "Cancelada",
        variant: "destructive" as const,
      };
    case "no-show":
      return {
        label: "Não compareceu",
        variant: "destructive" as const,
        className: "bg-amber-500",
      };
    default:
      return {
        label: status,
        variant: "outline" as const,
      };
  }
};

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

  const createRecurringAppointments = (baseAppointment: Appointment) => {
    // Create appointments for the next 8 weeks
    const recurringAppointments = [];
    
    for (let i = 1; i <= 8; i++) {
      const futureDate = new Date(baseAppointment.date);
      futureDate.setDate(futureDate.getDate() + (i * 7)); // Add weeks
      
      recurringAppointments.push({
        ...baseAppointment,
        id: `${baseAppointment.id}-week-${i}`,
        date: futureDate,
        isRecurring: true
      });
    }
    
    return recurringAppointments;
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
    
    setSelectedPatientId("");
    setSelectedSlot(null);
    setIsRecurring(false);
    setAppointmentNotes("");
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
    
    setSelectedSlot(null);
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

  const getAppointmentsForDayAndTime = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        isSameDay(appointmentDate, day) &&
        appointmentDate.getHours() === hours &&
        appointmentDate.getMinutes() === minutes
      );
    });
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
      <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-2xl">Agenda Semanal</CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(weekStart, "'Semana de' dd 'de' MMMM", { locale: ptBR })} a{" "}
            {format(addDays(weekStart, 6), "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek} className="button-bounce">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Semana anterior</span>
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek} className="button-bounce">
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek} className="button-bounce">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima semana</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-1">
              <div className="h-12"></div>
              {weekDays.map((day, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-md font-medium",
                    isToday(day) && "bg-primary/10 text-primary"
                  )}
                >
                  <div className="text-xs text-muted-foreground uppercase">
                    {format(day, "EEE", { locale: ptBR })}
                  </div>
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full",
                    isToday(day) && "bg-primary text-primary-foreground"
                  )}>
                    {format(day, "d")}
                  </div>
                </div>
              ))}
            </div>

            {TIME_SLOTS.map((timeSlot, timeIndex) => (
              <div 
                key={timeSlot} 
                className="grid grid-cols-8 gap-1 border-t bg-white"
              >
                <div className="px-2 py-3 text-xs text-muted-foreground text-right">
                  {timeSlot}
                </div>
                
                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = getAppointmentsForDayAndTime(day, timeSlot);
                  const hasAppointment = dayAppointments.length > 0;
                  const isAvailable = isSlotAvailable(day, timeSlot);
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className={cn(
                        "min-h-[60px] p-1 relative",
                        isToday(day) && "bg-primary/5"
                      )}
                    >
                      {hasAppointment ? (
                        dayAppointments.map((appointment) => (
                          <div 
                            key={appointment.id}
                            className={cn(
                              "p-1 rounded-md text-xs h-full border-l-2 cursor-pointer hover:bg-accent transition-colors",
                              appointment.status === "scheduled" && "border-l-primary bg-primary/10",
                              appointment.status === "completed" && "border-l-green-500 bg-green-500/10",
                              appointment.status === "canceled" && "border-l-destructive bg-destructive/10",
                              appointment.status === "no-show" && "border-l-amber-500 bg-amber-500/10"
                            )}
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="font-medium truncate flex items-center">
                              {appointment.patientName}
                              {appointment.isRecurring && (
                                <Repeat className="h-3 w-3 ml-1 opacity-70" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge
                                variant={getStatusDetails(appointment.status).variant}
                                className={cn(
                                  "text-[10px] px-1 py-0",
                                  getStatusDetails(appointment.status).className
                                )}
                              >
                                {getStatusDetails(appointment.status).label}
                              </Badge>
                              {appointment.paid ? (
                                <Badge variant="outline" className="text-[10px] px-1 py-0 bg-green-500 text-white">
                                  Pago
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] px-1 py-0 bg-amber-500 text-white">
                                  Pendente
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))
                      ) : isAvailable ? (
                        <div 
                          className="h-full w-full flex items-center justify-center rounded-md border-dashed border border-primary/40 cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={() => setSelectedSlot({ day, time: timeSlot })}
                        >
                          <span className="text-xs text-primary">Disponível</span>
                        </div>
                      ) : (
                        <div 
                          className="h-full w-full flex items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors"
                          onClick={() => addSlotAvailability(day, timeSlot)}
                        >
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Plus className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Adicionar disponibilidade</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Dialog for scheduling an appointment */}
      {selectedSlot && !isEditMode && (
        <Dialog open={!!selectedSlot && !isEditMode} onOpenChange={() => resetDialogState()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Opções de Agendamento</DialogTitle>
              <DialogDescription>
                {selectedSlot ? `${format(selectedSlot.day, "EEEE, dd 'de' MMMM", { locale: ptBR })} às ${selectedSlot.time}` : ""}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="patient-select" className="text-sm font-medium">
                  Selecione o paciente
                </Label>
                <Select
                  value={selectedPatientId}
                  onValueChange={setSelectedPatientId}
                >
                  <SelectTrigger id="patient-select" className="w-full">
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Observações</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Adicione observações sobre esta consulta"
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  className="resize-none"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="recurring" 
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
                <Label htmlFor="recurring" className="text-sm font-medium">
                  Consulta recorrente (semanal)
                </Label>
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-2">
                <Button 
                  onClick={scheduleNewAppointment}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Agendar consulta
                </Button>
                
                <Button 
                  onClick={reserveTimeSlot}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Reservar horário
                </Button>
                
                <Button 
                  onClick={openNewPatientDialog} 
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Adicionar novo paciente
                </Button>
                
                <Button 
                  onClick={() => selectedSlot && removeSlotAvailability(selectedSlot.day, selectedSlot.time)} 
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                  Remover disponibilidade
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog for editing an appointment */}
      {isEditMode && selectedAppointment && (
        <Dialog open={isEditMode && !!selectedAppointment} onOpenChange={() => resetDialogState()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Gerenciar Consulta</DialogTitle>
              <DialogDescription>
                {format(new Date(selectedAppointment.date), "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-patient-select" className="text-sm font-medium">
                  Paciente
                </Label>
                <Select
                  value={selectedPatientId}
                  onValueChange={setSelectedPatientId}
                  disabled={selectedAppointment.patientId === "reserved"}
                >
                  <SelectTrigger id="edit-patient-select" className="w-full">
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes" className="text-sm font-medium">Observações</Label>
                <Textarea 
                  id="edit-notes" 
                  placeholder="Adicione observações sobre esta consulta"
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  className="resize-none"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-recurring" 
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
                <Label htmlFor="edit-recurring" className="text-sm font-medium">
                  Consulta recorrente (semanal)
                </Label>
              </div>
              
              <Separator className="my-2" />
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={updateAppointment}
                  className="flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Atualizar
                </Button>
                
                <Button 
                  onClick={completeAppointment}
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-green-500/50 text-green-600 hover:bg-green-500/10"
                  disabled={selectedAppointment.status === "completed"}
                >
                  <Calendar className="h-4 w-4" />
                  Realizada
                </Button>
                
                <Button 
                  onClick={cancelAppointment}
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                  disabled={selectedAppointment.status === "canceled"}
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                
                <Button 
                  onClick={markNoShow}
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                  disabled={selectedAppointment.status === "no-show"}
                >
                  <Clock className="h-4 w-4" />
                  Não compareceu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog for adding a new patient */}
      <Dialog open={isNewPatientDialogOpen} onOpenChange={setIsNewPatientDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Paciente</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo paciente abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </Label>
              <Input
                id="name"
                name="name"
                value={newPatient.name}
                onChange={handleNewPatientChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newPatient.email}
                onChange={handleNewPatientChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Telefone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={newPatient.phone}
                onChange={handleNewPatientChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Observações
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={newPatient.notes}
                onChange={handleNewPatientChange}
                className="w-full resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsNewPatientDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={saveNewPatient}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
