
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, UserPlus, X } from "lucide-react";
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
import { patients } from "@/lib/data";

interface AppointmentDialogProps {
  open: boolean;
  selectedSlot: { day: Date, time: string } | null;
  onClose: () => void;
  onScheduleAppointment: () => void;
  onReserveTimeSlot: () => void;
  onOpenNewPatientDialog: () => void;
  onRemoveAvailability: () => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  appointmentNotes: string;
  setAppointmentNotes: (notes: string) => void;
}

export default function AppointmentDialog({
  open,
  selectedSlot,
  onClose,
  onScheduleAppointment,
  onReserveTimeSlot,
  onOpenNewPatientDialog,
  onRemoveAvailability,
  selectedPatientId,
  setSelectedPatientId,
  isRecurring,
  setIsRecurring,
  appointmentNotes,
  setAppointmentNotes
}: AppointmentDialogProps) {
  if (!selectedSlot) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Opções de Agendamento</DialogTitle>
          <DialogDescription>
            {format(selectedSlot.day, "EEEE, dd 'de' MMMM", { locale: ptBR })} às {selectedSlot.time}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient-select" className="text-sm font-medium">
              Selecione o paciente
            </Label>
            <Select
              value={selectedPatientId}
              onValueChange={setSelectedPatientId}
            >
              <SelectTrigger id="patient-select" className="w-full">
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
            <Label htmlFor="notes" className="text-sm font-medium">Observações</Label>
            <Textarea 
              id="notes" 
              placeholder="Adicione observações sobre esta consulta"
              value={appointmentNotes}
              onChange={(e) => setAppointmentNotes(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="recurring" 
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="recurring" className="text-sm font-medium">
              Consulta recorrente (semanal)
            </Label>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-2">
            <Button 
              onClick={onScheduleAppointment}
              className="w-full flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Agendar consulta
            </Button>
            
            <Button 
              onClick={onReserveTimeSlot}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Reservar horário
            </Button>
            
            <Button 
              onClick={onOpenNewPatientDialog} 
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Adicionar novo paciente
            </Button>
            
            <Button 
              onClick={onRemoveAvailability} 
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Remover disponibilidade
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
