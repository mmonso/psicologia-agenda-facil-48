
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Patient, appointments } from "@/lib/data";
import { cn } from "@/lib/utils";
import { getStatusBadge, getInitials } from "./PatientTable";
import { PatientInfoTab } from "./PatientInfoTab";
import { PatientAppointmentsTab } from "./PatientAppointmentsTab";
import { PatientMedicalRecordTab } from "./PatientMedicalRecordTab";

// Get patient's appointment count
const getPatientAppointments = (patientId: string) => {
  return appointments.filter((app) => app.patientId === patientId);
};

interface PatientDetailDialogProps {
  selectedPatient: Patient | null;
  isEditMode: boolean;
  editedPatient: Patient | null;
  medicalNotes: string;
  onDialogClose: () => void;
  onEnableEditMode: () => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onStatusChange: (status: Patient["status"]) => void;
  onSavePatient: () => void;
  onMedicalNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSaveMedicalNotes: () => void;
}

export function PatientDetailDialog({
  selectedPatient,
  isEditMode,
  editedPatient,
  medicalNotes,
  onDialogClose,
  onEnableEditMode,
  onEditChange,
  onStatusChange,
  onSavePatient,
  onMedicalNotesChange,
  onSaveMedicalNotes
}: PatientDetailDialogProps) {
  if (!selectedPatient) return null;

  // Get patient's appointments
  const patientAppointments = getPatientAppointments(selectedPatient.id);

  return (
    <Dialog open={!!selectedPatient} onOpenChange={onDialogClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Avatar className="h-9 w-9 border">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(selectedPatient.name)}
              </AvatarFallback>
            </Avatar>
            <span>{isEditMode ? editedPatient?.name : selectedPatient.name}</span>
            {isEditMode ? (
              <div className="flex gap-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "cursor-pointer",
                    editedPatient?.status === "active" && "bg-green-500"
                  )}
                  onClick={() => onStatusChange("active")}
                >
                  Ativo
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "cursor-pointer",
                    editedPatient?.status === "inactive" && "bg-muted"
                  )}
                  onClick={() => onStatusChange("inactive")}
                >
                  Inativo
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "cursor-pointer",
                    editedPatient?.status === "waiting" && "bg-amber-500"
                  )}
                  onClick={() => onStatusChange("waiting")}
                >
                  Em espera
                </Badge>
              </div>
            ) : (
              getStatusBadge(selectedPatient.status)
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-2">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="appointments">Sessões</TabsTrigger>
            <TabsTrigger value="medical-record">Prontuário</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <PatientInfoTab
              selectedPatient={selectedPatient}
              editedPatient={editedPatient}
              isEditMode={isEditMode}
              onEnableEditMode={onEnableEditMode}
              onCancelEdit={() => onDialogClose()}
              onSavePatient={onSavePatient}
              onEditChange={onEditChange}
            />
          </TabsContent>

          <TabsContent value="appointments">
            <PatientAppointmentsTab patientAppointments={patientAppointments} />
          </TabsContent>

          <TabsContent value="medical-record">
            <PatientMedicalRecordTab
              selectedPatient={selectedPatient}
              medicalNotes={medicalNotes}
              onMedicalNotesChange={onMedicalNotesChange}
              onSaveMedicalNotes={onSaveMedicalNotes}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
