
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Patient } from "@/lib/data";
import { formatDate } from "@/lib/data";

interface PatientTableRowProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
  getStatusBadge: (status: Patient["status"]) => React.ReactNode;
  getInitials: (name: string) => string;
}

export function PatientTableRow({ 
  patient, 
  onSelect, 
  getStatusBadge,
  getInitials 
}: PatientTableRowProps) {
  return (
    <TableRow className="hover:bg-muted/40">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{patient.name}</div>
            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
              {patient.notes}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div>{patient.email}</div>
          <div className="text-muted-foreground">{patient.phone}</div>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(patient.status)}</TableCell>
      <TableCell>
        {formatDate(patient.startDate, "dd/MM/yyyy")}
      </TableCell>
      <TableCell>{patient.totalSessions}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSelect(patient)}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver paciente</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
