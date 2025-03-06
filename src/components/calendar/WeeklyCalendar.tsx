import { useState, useMemo, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Calendar, Menu, X, User, UserPlus, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { appointments, AppointmentStatus } from "@/lib/data";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  }, []);

  useEffect(() => {
    localStorage.setItem('availableSlots', JSON.stringify(availableSlots));
  }, [availableSlots]);

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

  const scheduleNewAppointment = (day: Date, timeSlot: string) => {
    toast({
      title: "Agendar nova consulta",
      description: `${format(day, "EEEE", { locale: ptBR })} às ${timeSlot}`,
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
    toast({
      title: "Paciente adicionado",
      description: `${newPatient.name} foi adicionado com sucesso.`,
    });
    
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      notes: ""
    });
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
          <Button size="sm" className="button-bounce">
            <Calendar className="h-4 w-4 mr-1" />
            Nova Consulta
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
                className={cn(
                  "grid grid-cols-8 gap-1 border-t",
                  timeSlot.endsWith("00") ? "bg-white" : "bg-gray-50/50"
                )}
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
                          >
                            <div className="font-medium truncate">
                              {appointment.patientName}
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
                          className="h-full w-full flex items-center justify-center rounded-md border cursor-pointer hover:bg-accent/30 transition-colors"
                          onClick={() => setSelectedSlot({ day, time: timeSlot })}
                        >
                          <span className="text-xs text-muted-foreground">Disponível</span>
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

      {selectedSlot && (
        <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Opções de Agendamento</DialogTitle>
              <DialogDescription>
                {selectedSlot ? `${format(selectedSlot.day, "EEEE, dd 'de' MMMM", { locale: ptBR })} às ${selectedSlot.time}` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button 
                onClick={() => selectedSlot && scheduleNewAppointment(selectedSlot.day, selectedSlot.time)}
                className="flex items-center justify-start"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Agendar consulta
              </Button>
              <Button 
                onClick={openNewPatientDialog} 
                variant="outline"
                className="flex items-center justify-start"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar novo paciente
              </Button>
              <Button 
                onClick={() => selectedSlot && removeSlotAvailability(selectedSlot.day, selectedSlot.time)} 
                variant="destructive"
                className="flex items-center justify-start"
              >
                <X className="mr-2 h-4 w-4" />
                Remover disponibilidade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isNewPatientDialogOpen} onOpenChange={setIsNewPatientDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Paciente</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo paciente abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Nome
              </label>
              <Input
                id="name"
                name="name"
                value={newPatient.name}
                onChange={handleNewPatientChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newPatient.email}
                onChange={handleNewPatientChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right text-sm font-medium">
                Telefone
              </label>
              <Input
                id="phone"
                name="phone"
                value={newPatient.phone}
                onChange={handleNewPatientChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right text-sm font-medium">
                Observações
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={newPatient.notes}
                onChange={handleNewPatientChange}
                className="col-span-3"
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
