
import AppointmentDialog from "../dialogs/AppointmentDialog";
import EditAppointmentDialog from "../dialogs/EditAppointmentDialog";
import NewPatientDialog from "../NewPatientDialog";
import { Appointment, NewPatient } from "../utils";

interface CalendarDialogsProps {
  selectedSlot: { day: Date; time: string } | null;
  isEditMode: boolean;
  onClose: () => void;
  onScheduleAppointment: () => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onCompleteAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
  onMarkNoShow: (appointment: Appointment) => void;
  onOpenNewPatientDialog: () => void;
  onOpenRemoveAvailabilityConfirmation: () => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  isRecurring: boolean;
  setIsRecurring: (isRecurring: boolean) => void;
  appointmentNotes: string;
  setAppointmentNotes: (notes: string) => void;
  selectedAppointment: Appointment | null;
  newPatient: NewPatient;
  isNewPatientDialogOpen: boolean;
  onSaveNewPatient: () => void;
  onHandleNewPatientChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCloseNewPatientDialog: () => void;
}

export function CalendarDialogs({
  selectedSlot,
  isEditMode,
  onClose,
  onScheduleAppointment,
  onUpdateAppointment,
  onCompleteAppointment,
  onCancelAppointment,
  onMarkNoShow,
  onOpenNewPatientDialog,
  onOpenRemoveAvailabilityConfirmation,
  selectedPatientId,
  setSelectedPatientId,
  isRecurring,
  setIsRecurring,
  appointmentNotes,
  setAppointmentNotes,
  selectedAppointment,
  newPatient,
  isNewPatientDialogOpen,
  onSaveNewPatient,
  onHandleNewPatientChange,
  onCloseNewPatientDialog
}: CalendarDialogsProps) {
  return (
    <>
      {/* Diálogo de agendamento */}
      <AppointmentDialog 
        open={!!selectedSlot && !isEditMode}
        selectedSlot={selectedSlot}
        onClose={onClose}
        onScheduleAppointment={onScheduleAppointment}
        onReserveTimeSlot={() => {}} // This function doesn't seem to be used
        onOpenNewPatientDialog={onOpenNewPatientDialog}
        onRemoveAvailability={onOpenRemoveAvailabilityConfirmation}
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
        onClose={onClose}
        onUpdateAppointment={onUpdateAppointment}
        onCompleteAppointment={onCompleteAppointment}
        onCancelAppointment={onCancelAppointment}
        onMarkNoShow={onMarkNoShow}
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
        onClose={onCloseNewPatientDialog}
        onSave={onSaveNewPatient}
        newPatient={newPatient}
        onChange={onHandleNewPatientChange}
      />
    </>
  );
}
