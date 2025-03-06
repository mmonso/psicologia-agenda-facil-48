
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Calendar, X, Clock } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patients, AppointmentStatus } from "@/lib/data";

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

interface EditAppointmentDialogProps {
  open: boolean;
  selectedAppointment: Appointment | null;
  onClose: () => void;
  onUpdateAppointment: () => void;
  onCompleteAppointment: () => void;
  onCancelAppointment: () => void;
  onMarkNoShow: () => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  appointmentNotes: string;
  setAppointmentNotes: (notes: string) => void;
}

export default function EditAppointmentDialog({
  open,
  selectedAppointment,
  onClose,
  onUpdateAppointment,
  onCompleteAppointment,
  onCancelAppointment,
  onMarkNoShow,
  selectedPatientId,
  setSelectedPatientId,
  isRecurring,
  setIsRecurring,
  appointmentNotes,
  setAppointmentNotes
}: EditAppointmentDialogProps) {
  if (!selectedAppointment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Consulta</DialogTitle>
          <DialogDescription>
            {format(new Date(selectedAppointment.date), "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-patient-select" className="text-sm font-medium">
              Paciente
            </Label>
            <Select
              value={selectedPatientId}
              onValueChange={setSelectedPatientId}
              disabled={selectedAppointment.patientId === "reserved"}
            >
              <SelectTrigger id="edit-patient-select" className="w-full">
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-notes" className="text-sm font-medium">Observações</Label>
            <Textarea 
              id="edit-notes" 
              placeholder="Adicione observações sobre esta consulta"
              value={appointmentNotes}
              onChange={(e) => setAppointmentNotes(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="edit-recurring" 
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="edit-recurring" className="text-sm font-medium">
              Consulta recorrente (semanal)
            </Label>
          </div>
          
          <Separator className="my-2" />
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={onUpdateAppointment}
              className="flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Atualizar
            </Button>
            
            <Button 
              onClick={onCompleteAppointment}
              variant="outline"
              className="flex items-center justify-center gap-2 border-green-500/50 text-green-600 hover:bg-green-500/10"
              disabled={selectedAppointment.status === "completed"}
            >
              <Calendar className="h-4 w-4" />
              Realizada
            </Button>
            
            <Button 
              onClick={onCancelAppointment}
              variant="outline"
              className="flex items-center justify-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              disabled={selectedAppointment.status === "canceled"}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            
            <Button 
              onClick={onMarkNoShow}
              variant="outline"
              className="flex items-center justify-center gap-2 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
              disabled={selectedAppointment.status === "no-show"}
            >
              <Clock className="h-4 w-4" />
              Não compareceu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
