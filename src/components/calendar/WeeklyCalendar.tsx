
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TIME_SLOTS, getStatusDetails } from "./utils";
import AppointmentDialog from "./dialogs/AppointmentDialog";
import EditAppointmentDialog from "./dialogs/EditAppointmentDialog";
import NewPatientDialog from "./NewPatientDialog";
import CalendarHeader from "./CalendarHeader";
import TimeSlots from "./TimeSlots";
import { useCalendarState } from "./hooks/useCalendarState";
import { useCalendarOperations } from "./hooks/useCalendarOperations";
import ConfirmationDialog from "./dialogs/ConfirmationDialog";

export default function WeeklyCalendar() {
  const state = useCalendarState();
  const {
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isSlotAvailable,
    addSlotAvailability,
    removeSlotAvailability,
    scheduleNewAppointment,
    reserveTimeSlot,
    handleAppointmentClick,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    markNoShow,
    resetDialogState,
    saveNewPatient,
  } = useCalendarOperations(state);

  const {
    weekStart,
    weekDays,
    selectedSlot,
    isNewPatientDialogOpen,
    setIsNewPatientDialogOpen,
    newPatient,
    setNewPatient,
    selectedPatientId,
    setSelectedPatientId,
    isRecurring,
    setIsRecurring,
    selectedAppointment,
    isEditMode,
    appointmentNotes,
    setAppointmentNotes,
    appointments
  } = state;

  // Estado para os diálogos de confirmação
  const [availabilityConfirmation, setAvailabilityConfirmation] = useState<{ day: Date, time: string } | null>(null);
  const [removeAvailabilityConfirmation, setRemoveAvailabilityConfirmation] = useState(false);

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value
    }));
  };

  const openNewPatientDialog = () => {
    setIsNewPatientDialogOpen(true);
  };

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
              onSelectSlot={(day, timeSlot) => state.setSelectedSlot({ day, time: timeSlot })}
              onAddAvailability={addSlotAvailability}
              onSelectAppointment={handleAppointmentClick}
              getStatusDetails={getStatusDetails}
              onOpenAddAvailabilityConfirmation={handleOpenAddAvailabilityConfirmation}
            />
          </div>
        </div>
      </CardContent>

      {/* Diálogo de agendamento */}
      <AppointmentDialog 
        open={!!selectedSlot && !isEditMode}
        selectedSlot={selectedSlot}
        onClose={resetDialogState}
        onScheduleAppointment={scheduleNewAppointment}
        onReserveTimeSlot={reserveTimeSlot}
        onOpenNewPatientDialog={openNewPatientDialog}
        onRemoveAvailability={handleOpenRemoveAvailabilityConfirmation}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        appointmentNotes={appointmentNotes}
        setAppointmentNotes={setAppointmentNotes}
      />

      {/* Diálogo de edição de consulta */}
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

      {/* Diálogo de novo paciente */}
      <NewPatientDialog 
        open={isNewPatientDialogOpen}
        onClose={() => setIsNewPatientDialogOpen(false)}
        onSave={saveNewPatient}
        newPatient={newPatient}
        onChange={handleNewPatientChange}
      />

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
    </Card>
  );
}
