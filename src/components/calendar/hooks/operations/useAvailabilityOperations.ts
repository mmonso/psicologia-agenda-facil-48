
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { AvailableSlot } from "../../utils";

interface AvailabilityOperationsProps {
  availableSlots: AvailableSlot[];
  setAvailableSlots: (slots: AvailableSlot[]) => void;
  setSelectedSlot: (slot: { day: Date; time: string } | null) => void;
}

export function useAvailabilityOperations({
  availableSlots,
  setAvailableSlots,
  setSelectedSlot,
}: AvailabilityOperationsProps) {
  const isSlotAvailable = (day: Date, timeSlot: string) => {
    const dayOfWeek = day.getDay();
    return availableSlots.some(slot => slot.day === dayOfWeek && slot.time === timeSlot);
  };

  const addSlotAvailability = (day: Date, timeSlot: string) => {
    const dayOfWeek = day.getDay();
    
    const newSlots = [
      ...availableSlots,
      { day: dayOfWeek, time: timeSlot }
    ];
    
    setAvailableSlots(newSlots);
    
    toast(`${format(day, "EEEE", { locale: ptBR })} às ${timeSlot} agora está disponível para consultas.`);
  };
  
  const removeSlotAvailability = (day: Date, timeSlot: string) => {
    const dayOfWeek = day.getDay();
    
    const filteredSlots = availableSlots.filter(
      slot => !(slot.day === dayOfWeek && slot.time === timeSlot)
    );
    
    setAvailableSlots(filteredSlots);
    
    toast(`${format(day, "EEEE", { locale: ptBR })} às ${timeSlot} não está mais disponível.`);

    setSelectedSlot(null);
  };

  return {
    isSlotAvailable,
    addSlotAvailability,
    removeSlotAvailability,
  };
}
