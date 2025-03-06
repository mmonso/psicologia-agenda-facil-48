
import { useState } from "react";
import { format, isToday } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AppointmentStatus } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Repeat } from "lucide-react";

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

interface StatusDetails {
  label: string;
  variant: "default" | "outline" | "destructive";
  className?: string;
}

interface CalendarTimeCellProps {
  day: Date;
  timeSlot: string;
  dayAppointments: Appointment[];
  isAvailable: boolean;
  onAddAvailability: () => void;
  onSelectSlot: () => void;
  onSelectAppointment: (appointment: Appointment) => void;
  getStatusDetails: (status: AppointmentStatus) => StatusDetails;
}

export default function CalendarTimeCell({
  day,
  timeSlot,
  dayAppointments,
  isAvailable,
  onAddAvailability,
  onSelectSlot,
  onSelectAppointment,
  getStatusDetails
}: CalendarTimeCellProps) {
  const hasAppointment = dayAppointments.length > 0;
  
  return (
    <div 
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
            onClick={() => onSelectAppointment(appointment)}
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
          onClick={onSelectSlot}
        >
          <span className="text-xs text-primary">Disponível</span>
        </div>
      ) : (
        <div 
          className="h-full w-full flex items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors"
          onClick={onAddAvailability}
        >
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Adicionar disponibilidade</span>
          </Button>
        </div>
      )}
    </div>
  );
}
