import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PageLayout } from "@/components/layout/PageLayout";
import { appointments, AppointmentStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

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

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "month">("day");

  // Filter appointments for the current date when in day view
  // or filter by search term in both views
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.notes.toLowerCase().includes(searchTerm.toLowerCase());

    if (view === "day") {
      return (
        isSameDay(new Date(appointment.date), date) && (searchTerm === "" || matchesSearch)
      );
    }
    
    return searchTerm === "" || matchesSearch;
  });

  // Sort appointments by time for day view
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const handlePrevDay = () => {
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  // Generate time slots for the day view
  const generateTimeSlots = () => {
    const timeSlots = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of [0, 30]) {
        const time = setMinutes(setHours(new Date(date), hour), minute);
        timeSlots.push(time);
      }
    }

    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  // Find appointment at a specific time slot
  const getAppointmentAtTime = (time: Date) => {
    return sortedAppointments.find((appointment) => {
      const appointmentTime = new Date(appointment.date);
      return (
        appointmentTime.getHours() === time.getHours() &&
        appointmentTime.getMinutes() === time.getMinutes() &&
        isSameDay(appointmentTime, time)
      );
    });
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Consultas</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant={view === "day" ? "default" : "outline"} 
              onClick={() => setView("day")}
              className="button-bounce"
            >
              Dia
            </Button>
            <Button 
              variant={view === "month" ? "default" : "outline"} 
              onClick={() => setView("month")}
              className="button-bounce"
            >
              Mês
            </Button>
            <Button className="button-bounce">
              <Plus className="mr-2 h-4 w-4" />
              Nova Consulta
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar consultas..."
              className="w-full bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-auto gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {format(date, view === "day" ? "dd 'de' MMMM, yyyy" : "MMMM yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                locale={ptBR}
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        {view === "day" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={handlePrevDay}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold">
                {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleNextDay}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {timeSlots.map((time, index) => {
                const appointment = getAppointmentAtTime(time);
                const isHalfHour = time.getMinutes() === 30;
                
                return (
                  <div 
                    key={index} 
                    className={cn(
                      "grid grid-cols-[80px_1fr] gap-2",
                      isHalfHour ? "opacity-50" : "opacity-100"
                    )}
                  >
                    <div className="flex items-center justify-end text-sm text-muted-foreground">
                      {format(time, "HH:mm")}
                    </div>
                    {appointment ? (
                      <Card 
                        className={cn(
                          "hover-card-effect border-l-4 border-l-primary",
                          appointment.status === "completed" && "border-l-green-500",
                          appointment.status === "canceled" && "border-l-destructive",
                          appointment.status === "no-show" && "border-l-amber-500"
                        )}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{appointment.patientName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {appointment.notes}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  appointment.paid 
                                    ? "bg-green-500 text-white" 
                                    : "bg-amber-500 text-white"
                                )}
                              >
                                {appointment.paid ? "Pago" : "Pendente"}
                              </Badge>
                              <Badge
                                variant={getStatusDetails(appointment.status).variant}
                                className={cn(getStatusDetails(appointment.status).className)}
                              >
                                {getStatusDetails(appointment.status).label}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="flex min-h-[70px] items-center rounded-md border border-dashed px-4">
                        <span className="text-muted-foreground">Disponível</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "month" && (
          <div className="rounded-md border bg-card p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  setDate(newDate);
                  setView("day");
                }
              }}
              className="w-full"
              locale={ptBR}
              modifiersStyles={{
                selected: {
                  backgroundColor: "hsl(var(--primary))",
                  color: "white",
                }
              }}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
