
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Patient } from "@/lib/data";
import { PatientTableRow } from "./PatientTableRow";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

// Get patient's initials from their name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Status badge component
const getStatusBadge = (status: Patient["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Ativo</Badge>;
    case "inactive":
      return <Badge variant="outline">Inativo</Badge>;
    case "waiting":
      return <Badge className="bg-amber-500">Em espera</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function PatientTable({ patients, onSelectPatient }: PatientTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de início</TableHead>
              <TableHead>Sessões</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center py-8">
                    <User className="h-10 w-10 text-muted-foreground/40 mb-2" />
                    Nenhum paciente encontrado
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <PatientTableRow
                  key={patient.id}
                  patient={patient}
                  onSelect={onSelectPatient}
                  getStatusBadge={getStatusBadge}
                  getInitials={getInitials}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export { getStatusBadge, getInitials };
