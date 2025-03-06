
import { format, isSameDay } from "date-fns";
import CalendarTimeCell from "./CalendarTimeCell";
import { AppointmentStatus } from "@/lib/data";

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

interface TimeSlotProps {
  timeSlots: string[];
  weekDays: Date[];
  appointments: Appointment[];
  isSlotAvailable: (day: Date, timeSlot: string) => boolean;
  onSelectSlot: (day: Date, timeSlot: string) => void;
  onAddAvailability: (day: Date, timeSlot: string) => void;
  onSelectAppointment: (appointment: Appointment) => void;
  getStatusDetails: (status: AppointmentStatus) => {
    label: string;
    variant: "default" | "outline" | "destructive";
    className?: string;
  };
}

export default function TimeSlots({
  timeSlots,
  weekDays,
  appointments,
  isSlotAvailable,
  onSelectSlot,
  onAddAvailability,
  onSelectAppointment,
  getStatusDetails
}: TimeSlotProps) {
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
    <>
      {timeSlots.map((timeSlot, timeIndex) => (
        <div 
          key={timeSlot} 
          className="grid grid-cols-8 gap-1 border-t bg-white"
        >
          <div className="px-2 py-3 text-xs text-muted-foreground text-right">
            {timeSlot}
          </div>
          
          {weekDays.map((day, dayIndex) => {
            const dayAppointments = getAppointmentsForDayAndTime(day, timeSlot);
            
            return (
              <CalendarTimeCell 
                key={dayIndex}
                day={day}
                timeSlot={timeSlot}
                dayAppointments={dayAppointments}
                isAvailable={isSlotAvailable(day, timeSlot)}
                onAddAvailability={() => onAddAvailability(day, timeSlot)}
                onSelectSlot={() => onSelectSlot(day, timeSlot)}
                onSelectAppointment={onSelectAppointment}
                getStatusDetails={getStatusDetails}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}
