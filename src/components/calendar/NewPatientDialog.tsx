
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewPatient {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface NewPatientDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  newPatient: NewPatient;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function NewPatientDialog({
  open,
  onClose,
  onSave,
  newPatient,
  onChange,
}: NewPatientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Paciente</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo paciente abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome completo
            </Label>
            <Input
              id="name"
              name="name"
              value={newPatient.name}
              onChange={onChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={newPatient.email}
              onChange={onChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Telefone
            </Label>
            <Input
              id="phone"
              name="phone"
              value={newPatient.phone}
              onChange={onChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Observações
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={newPatient.notes}
              onChange={onChange}
              className="w-full resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={onSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
