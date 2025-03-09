
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { Appointment } from "../utils";

interface AvailabilityActionsProps {
  selectedSlot: { day: Date; time: string } | null;
  addSlotAvailability: (day: Date, time: string) => void;
  removeSlotAvailability: (day: Date, time: string) => void;
}

export function AvailabilityActions({
  selectedSlot,
  addSlotAvailability,
  removeSlotAvailability
}: AvailabilityActionsProps) {
  const [availabilityConfirmation, setAvailabilityConfirmation] = useState<{ day: Date, time: string } | null>(null);
  const [removeAvailabilityConfirmation, setRemoveAvailabilityConfirmation] = useState(false);

  const handleOpenAddAvailabilityConfirmation = (day: Date, timeSlot: string) => {
    setAvailabilityConfirmation({ day, time: timeSlot });
  };

  const handleCloseAddAvailabilityConfirmation = () => {
    setAvailabilityConfirmation(null);
  };

  const handleConfirmAddAvailability = () => {
    if (availabilityConfirmation) {
      addSlotAvailability(availabilityConfirmation.day, availabilityConfirmation.time);
      setAvailabilityConfirmation(null);
    }
  };

  const handleOpenRemoveAvailabilityConfirmation = () => {
    setRemoveAvailabilityConfirmation(true);
  };

  const handleCloseRemoveAvailabilityConfirmation = () => {
    setRemoveAvailabilityConfirmation(false);
  };

  const handleConfirmRemoveAvailability = () => {
    if (selectedSlot) {
      removeSlotAvailability(selectedSlot.day, selectedSlot.time);
      setRemoveAvailabilityConfirmation(false);
    }
  };

  return (
    <>
      {/* Diálogo de confirmação para adicionar disponibilidade */}
      <ConfirmationDialog
        open={!!availabilityConfirmation}
        onClose={handleCloseAddAvailabilityConfirmation}
        onConfirm={handleConfirmAddAvailability}
        title="Adicionar disponibilidade"
        description={availabilityConfirmation ? 
          `Deseja tornar o horário de ${format(availabilityConfirmation.day, "EEEE", { locale: ptBR })} às ${availabilityConfirmation.time} disponível para agendamentos?` : 
          ""
        }
        confirmText="Sim, tornar disponível"
        cancelText="Cancelar"
      />

      {/* Diálogo de confirmação para remover disponibilidade */}
      <ConfirmationDialog
        open={removeAvailabilityConfirmation}
        onClose={handleCloseRemoveAvailabilityConfirmation}
        onConfirm={handleConfirmRemoveAvailability}
        title="Remover disponibilidade"
        description={selectedSlot ? 
          `Deseja remover a disponibilidade de ${format(selectedSlot.day, "EEEE", { locale: ptBR })} às ${selectedSlot.time}?` : 
          "Deseja remover esta disponibilidade?"
        }
        confirmText="Sim, remover"
        cancelText="Cancelar"
      />
    </>
  );
}
