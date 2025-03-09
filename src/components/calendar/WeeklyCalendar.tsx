
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TIME_SLOTS, getStatusDetails } from "./utils";
import AppointmentDialog from "./dialogs/AppointmentDialog";
import EditAppointmentDialog from "./dialogs/EditAppointmentDialog";
import NewPatientDialog from "./NewPatientDialog";
import CalendarHeader from "./CalendarHeader";
import TimeSlots from "./TimeSlots";
import { useCalendarState } from "./hooks/useCalendarState";
import { useCalendarOperations } from "./hooks/useCalendarOperations";

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

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPatient(prevPatient => ({
      ...prevPatient,
      [name]: value
    }));
  };

  const openNewPatientDialog = () => {
    setIsNewPatientDialogOpen(true);
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
            />
          </div>
        </div>
      </CardContent>

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
