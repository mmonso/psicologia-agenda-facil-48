
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal, CalendarPlus, FileEdit, Trash2 } from "lucide-react";
import { formatDate, patients, PatientStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

const getStatusDetails = (status: PatientStatus) => {
  switch (status) {
    case "active":
      return {
        label: "Ativo",
        variant: "default",
        className: "bg-green-500",
      };
    case "inactive":
      return {
        label: "Inativo",
        variant: "outline" as const,
      };
    case "waiting":
      return {
        label: "Aguardando",
        variant: "secondary" as const,
      };
    default:
      return {
        label: status,
        variant: "outline" as const,
      };
  }
};

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <Button className="button-bounce">
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="w-full bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Sessões</TableHead>
                <TableHead>Próx. Consulta</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const statusDetails = getStatusDetails(patient.status);
                  
                  return (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusDetails.variant}
                          className={cn(statusDetails.className)}
                        >
                          {statusDetails.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(patient.startDate, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{patient.totalSessions}</TableCell>
                      <TableCell>
                        {patient.nextAppointment
                          ? formatDate(patient.nextAppointment, "dd/MM/yyyy")
                          : "Não agendado"}
                      </TableCell>
                      <TableCell>
                        <div>{patient.email}</div>
                        <div className="text-muted-foreground">
                          {patient.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <CalendarPlus className="mr-2 h-4 w-4" />
                              Agendar consulta
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Editar paciente
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir paciente
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
}
