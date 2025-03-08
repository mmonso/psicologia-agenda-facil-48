
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Patient } from "@/lib/data";
import { formatDate } from "@/lib/data";

interface PatientInfoTabProps {
  selectedPatient: Patient;
  editedPatient: Patient | null;
  isEditMode: boolean;
  onEnableEditMode: () => void;
  onCancelEdit: () => void;
  onSavePatient: () => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PatientInfoTab({
  selectedPatient,
  editedPatient,
  isEditMode,
  onEnableEditMode,
  onCancelEdit,
  onSavePatient,
  onEditChange
}: PatientInfoTabProps) {
  return (
    <div className="space-y-4 pt-4">
      {isEditMode ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={editedPatient?.name}
                onChange={onEditChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editedPatient?.email}
                onChange={onEditChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={editedPatient?.phone}
                onChange={onEditChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalSessions">Total de sessões</Label>
              <Input
                id="totalSessions"
                name="totalSessions"
                type="number"
                value={editedPatient?.totalSessions}
                onChange={(e) => {
                  if (editedPatient) {
                    onEditChange({
                      ...e,
                      target: {
                        ...e.target,
                        name: "totalSessions",
                        value: e.target.value
                      }
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              value={editedPatient?.notes}
              onChange={onEditChange}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={onCancelEdit}
            >
              Cancelar
            </Button>
            <Button onClick={onSavePatient}>
              Salvar alterações
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
              <p>{selectedPatient.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Telefone</h3>
              <p>{selectedPatient.phone}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Data de início</h3>
              <p>{formatDate(selectedPatient.startDate, "dd 'de' MMMM 'de' yyyy")}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Total de sessões</h3>
              <p>{selectedPatient.totalSessions}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Observações</h3>
            <p>{selectedPatient.notes}</p>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onEnableEditMode}>
              Editar informações
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
