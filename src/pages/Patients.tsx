
import { useState } from "react";
import { Eye, Plus, Search, User } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { patients, Patient, appointments } from "@/lib/data";
import { formatDate } from "@/lib/data";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

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

// Get patient's initials from their name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Get patient's appointment count
const getPatientAppointments = (patientId: string) => {
  return appointments.filter((app) => app.patientId === patientId);
};

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicalNotes, setMedicalNotes] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
  const [localPatients, setLocalPatients] = useState<Patient[]>(patients);

  // Filter patients based on search term
  const filteredPatients = localPatients.filter((patient) => {
    return (
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle patient selection
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditMode(false);
    // In a real app, you would fetch medical notes from the backend
    setMedicalNotes(patient.notes);
  };

  // Close patient dialog
  const handleCloseDialog = () => {
    setSelectedPatient(null);
    setIsEditMode(false);
    setEditedPatient(null);
  };

  // Enable edit mode
  const handleEnableEditMode = () => {
    if (selectedPatient) {
      setEditedPatient({...selectedPatient});
      setIsEditMode(true);
    }
  };

  // Handle edit inputs change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedPatient) {
      setEditedPatient({
        ...editedPatient,
        [e.target.name]: e.target.value
      });
    }
  };

  // Handle status change
  const handleStatusChange = (status: Patient["status"]) => {
    if (editedPatient) {
      setEditedPatient({
        ...editedPatient,
        status
      });
    }
  };

  // Save edited patient
  const handleSavePatient = () => {
    if (editedPatient) {
      // In a real app, you would save to backend here
      setLocalPatients(localPatients.map(p => 
        p.id === editedPatient.id ? editedPatient : p
      ));
      
      setSelectedPatient(editedPatient);
      setIsEditMode(false);
      toast.success("Informações do paciente atualizadas com sucesso!");
    }
  };

  // Save medical notes
  const handleSaveMedicalNotes = () => {
    if (selectedPatient) {
      // Update the patient's notes
      const updatedPatient = {
        ...selectedPatient,
        notes: medicalNotes
      };
      
      // Update local patients state
      setLocalPatients(localPatients.map(p => 
        p.id === selectedPatient.id ? updatedPatient : p
      ));
      
      setSelectedPatient(updatedPatient);
      toast.success("Prontuário médico atualizado com sucesso!");
    }
  };

  // Get patient's appointments
  const patientAppointments = selectedPatient
    ? getPatientAppointments(selectedPatient.id)
    : [];

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Paciente
          </Button>
        </div>

        <div className="relative flex-1 mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar pacientes..."
            className="w-full bg-background pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum paciente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => {
                    const patientAppointments = getPatientAppointments(patient.id);
                    return (
                      <TableRow key={patient.id} className="hover:bg-muted/40">
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
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver paciente</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Patient details dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => handleCloseDialog()}>
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
                      onClick={() => handleStatusChange("active")}
                    >
                      Ativo
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "cursor-pointer",
                        editedPatient?.status === "inactive" && "bg-muted"
                      )}
                      onClick={() => handleStatusChange("inactive")}
                    >
                      Inativo
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "cursor-pointer",
                        editedPatient?.status === "waiting" && "bg-amber-500"
                      )}
                      onClick={() => handleStatusChange("waiting")}
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

              <TabsContent value="info" className="space-y-4 pt-4">
                {isEditMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          name="name"
                          value={editedPatient?.name}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editedPatient?.email}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={editedPatient?.phone}
                          onChange={handleEditChange}
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
                              setEditedPatient({
                                ...editedPatient,
                                totalSessions: parseInt(e.target.value) || 0
                              });
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
                        onChange={handleEditChange}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditMode(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSavePatient}>
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
                      <Button variant="outline" onClick={handleEnableEditMode}>
                        Editar informações
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="appointments" className="pt-4">
                {patientAppointments.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <User className="mx-auto h-10 w-10 mb-2 opacity-20" />
                    <p>Nenhuma sessão registrada para este paciente.</p>
                    <Button className="mt-4" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Agendar sessão
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Histórico de sessões</h3>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Agendar sessão
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {patientAppointments
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((appointment) => {
                          const statusMap = {
                            scheduled: {
                              label: "Agendada",
                              className: "bg-primary"
                            },
                            completed: {
                              label: "Realizada",
                              className: "bg-green-500"
                            },
                            canceled: {
                              label: "Cancelada",
                              className: "bg-destructive"
                            },
                            "no-show": {
                              label: "Não compareceu",
                              className: "bg-amber-500"
                            }
                          };
                          
                          return (
                            <Card key={appointment.id} className="hover-card-effect">
                              <CardContent className="p-4">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-medium">
                                      {formatDate(appointment.date, "dd 'de' MMMM 'de' yyyy")} às{" "}
                                      {formatDate(appointment.date, "HH:mm")}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {appointment.notes}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-xs",
                                        appointment.paid 
                                          ? "bg-green-500 text-white" 
                                          : "bg-amber-500 text-white"
                                      )}
                                    >
                                      {appointment.paid ? "Pago" : "Pendente"}
                                    </Badge>
                                    <Badge
                                      className={cn(statusMap[appointment.status]?.className)}
                                    >
                                      {statusMap[appointment.status]?.label}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="medical-record" className="pt-4">
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
                      onChange={(e) => setMedicalNotes(e.target.value)}
                    />
                    
                    <div className="flex justify-end mt-4">
                      <Button onClick={handleSaveMedicalNotes}>Salvar prontuário</Button>
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
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  );
}
