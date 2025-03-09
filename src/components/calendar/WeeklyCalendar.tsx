
import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { TIME_SLOTS, getStatusDetails } from "./utils";
import CalendarHeader from "./CalendarHeader";
import { useCalendarState } from "./hooks/useCalendarState";
import { useCalendarOperations } from "./hooks/useCalendarOperations";
import { CalendarContent } from "./components/CalendarContent";
import { CalendarDialogs } from "./components/CalendarDialogs";
import { AvailabilityActions } from "./components/AvailabilityActions";

export default function WeeklyCalendar() {
  const state = useCalendarState();
  const operations = useCalendarOperations(state);

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

  const {
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isSlotAvailable,
    addSlotAvailability,
    removeSlotAvailability,
    scheduleNewAppointment,
    handleAppointmentClick,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    markNoShow,
    resetDialogState,
    saveNewPatient,
  } = operations;

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

  const handleSelectSlot = (day: Date, timeSlot: string) => {
    setSelectedSlot({ day, time: timeSlot });
  };

  const handleOpenAddAvailabilityConfirmation = (day: Date, timeSlot: string) => {
    // This will be handled by AvailabilityActions component
    setSelectedSlot({ day, time: timeSlot });
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
      
      <CalendarContent
        timeSlots={TIME_SLOTS}
        weekDays={weekDays}
        appointments={appointments}
        isSlotAvailable={isSlotAvailable}
        onSelectSlot={handleSelectSlot}
        onSelectAppointment={handleAppointmentClick}
        onOpenAddAvailabilityConfirmation={handleOpenAddAvailabilityConfirmation}
        getStatusDetails={getStatusDetails}
      />

      <CalendarDialogs
        selectedSlot={selectedSlot}
        isEditMode={isEditMode}
        onClose={resetDialogState}
        onScheduleAppointment={scheduleNewAppointment}
        onUpdateAppointment={updateAppointment}
        onCompleteAppointment={completeAppointment}
        onCancelAppointment={cancelAppointment}
        onMarkNoShow={markNoShow}
        onOpenNewPatientDialog={openNewPatientDialog}
        onOpenRemoveAvailabilityConfirmation={() => setSelectedSlot(selectedSlot)}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        appointmentNotes={appointmentNotes}
        setAppointmentNotes={setAppointmentNotes}
        selectedAppointment={selectedAppointment}
        newPatient={newPatient}
        isNewPatientDialogOpen={isNewPatientDialogOpen}
        onSaveNewPatient={saveNewPatient}
        onHandleNewPatientChange={handleNewPatientChange}
        onCloseNewPatientDialog={() => setIsNewPatientDialogOpen(false)}
      />

      <AvailabilityActions
        selectedSlot={selectedSlot}
        addSlotAvailability={addSlotAvailability}
        removeSlotAvailability={removeSlotAvailability}
      />
    </Card>
  );
}
