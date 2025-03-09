
import { Card, CardContent } from "@/components/ui/card";
import TimeSlots from "../TimeSlots";
import { Appointment } from "../utils";
import { AppointmentStatus } from "@/lib/data";

interface CalendarContentProps {
  timeSlots: string[];
  weekDays: Date[];
  appointments: Appointment[];
  isSlotAvailable: (day: Date, timeSlot: string) => boolean;
  onSelectSlot: (day: Date, timeSlot: string) => void;
  onSelectAppointment: (appointment: Appointment) => void;
  onOpenAddAvailabilityConfirmation: (day: Date, timeSlot: string) => void;
  getStatusDetails: (status: AppointmentStatus) => {
    label: string;
    variant: "default" | "outline" | "destructive";
    className?: string;
  };
}

export function CalendarContent({
  timeSlots,
  weekDays,
  appointments,
  isSlotAvailable,
  onSelectSlot,
  onSelectAppointment,
  onOpenAddAvailabilityConfirmation,
  getStatusDetails
}: CalendarContentProps) {
  return (
    <CardContent>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <TimeSlots 
            timeSlots={timeSlots}
            weekDays={weekDays}
            appointments={appointments}
            isSlotAvailable={isSlotAvailable}
            onSelectSlot={onSelectSlot}
            onAddAvailability={() => {}} // This function is replaced by confirmation dialog
            onSelectAppointment={onSelectAppointment}
            getStatusDetails={getStatusDetails}
            onOpenAddAvailabilityConfirmation={onOpenAddAvailabilityConfirmation}
          />
        </div>
      </div>
    </CardContent>
  );
}
