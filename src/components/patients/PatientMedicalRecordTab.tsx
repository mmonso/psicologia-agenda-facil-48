
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Patient } from "@/lib/data";
import { formatDate } from "@/lib/data";

interface PatientMedicalRecordTabProps {
  selectedPatient: Patient;
  medicalNotes: string;
  onMedicalNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSaveMedicalNotes: () => void;
}

export function PatientMedicalRecordTab({
  selectedPatient,
  medicalNotes,
  onMedicalNotesChange,
  onSaveMedicalNotes
}: PatientMedicalRecordTabProps) {
  return (
    <div className="pt-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Prontuário médico</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Registre informações confidenciais sobre o paciente aqui.
          </p>
          
          <Textarea
            placeholder="Escreva suas anotações médicas aqui..."
            className="min-h-[200px]"
            value={medicalNotes}
            onChange={onMedicalNotesChange}
          />
          
          <div className="flex justify-end mt-4">
            <Button onClick={onSaveMedicalNotes}>Salvar prontuário</Button>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="font-medium mb-2">Histórico de prontuário</h3>
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Avaliação inicial</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedPatient.startDate, "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm">
                {selectedPatient.notes}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
