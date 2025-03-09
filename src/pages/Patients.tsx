
import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Patient } from "@/components/calendar/utils";
import { toast } from "sonner";
import NewPatientDialog from "@/components/calendar/NewPatientDialog";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientDetailDialog } from "@/components/patients/PatientDetailDialog";

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicalNotes, setMedicalNotes] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
  const [localPatients, setLocalPatients] = useState<Patient[]>([]);
  
  // Estado para o novo paciente e o diálogo
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  // Carregar pacientes do localStorage
  useEffect(() => {
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      try {
        const parsedPatients = JSON.parse(savedPatients);
        // Converter data strings para objetos Date
        const formattedPatients = parsedPatients.map((p: any) => ({
          ...p,
          startDate: new Date(p.startDate),
          nextAppointment: p.nextAppointment ? new Date(p.nextAppointment) : null
        }));
        setLocalPatients(formattedPatients);
      } catch (e) {
        console.error('Erro ao carregar pacientes:', e);
      }
    }
  }, []);

  // Salvar pacientes no localStorage quando mudarem
  useEffect(() => {
    if (localPatients.length > 0) {
      localStorage.setItem('patients', JSON.stringify(localPatients));
    }
  }, [localPatients]);

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
      if (e.target.name === "totalSessions") {
        setEditedPatient({
          ...editedPatient,
          totalSessions: parseInt(e.target.value) || 0
        });
      } else {
        setEditedPatient({
          ...editedPatient,
          [e.target.name]: e.target.value
        });
      }
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
      // Update patient in local state
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

  // Handle new patient dialog
  const openNewPatientDialog = () => {
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      notes: ""
    });
    setIsNewPatientDialogOpen(true);
  };

  const closeNewPatientDialog = () => {
    setIsNewPatientDialogOpen(false);
  };

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPatient({
      ...newPatient,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveNewPatient = () => {
    // Validar entradas
    if (!newPatient.name.trim()) {
      toast.error("Nome do paciente é obrigatório");
      return;
    }

    // Criar novo paciente
    const newPatientData: Patient = {
      id: `patient-${Date.now()}`,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      startDate: new Date(),
      status: "active",
      totalSessions: 0,
      notes: newPatient.notes,
      nextAppointment: null
    };

    // Adicionar à lista
    setLocalPatients([...localPatients, newPatientData]);
    
    // Fechar diálogo e mostrar toast
    closeNewPatientDialog();
    toast.success("Paciente adicionado com sucesso!");
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <Button className="gap-2" onClick={openNewPatientDialog}>
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

        <PatientTable 
          patients={filteredPatients} 
          onSelectPatient={handlePatientSelect} 
        />
      </div>

      {/* Patient details dialog */}
      <PatientDetailDialog
        selectedPatient={selectedPatient}
        isEditMode={isEditMode}
        editedPatient={editedPatient}
        medicalNotes={medicalNotes}
        onDialogClose={handleCloseDialog}
        onEnableEditMode={handleEnableEditMode}
        onEditChange={handleEditChange}
        onStatusChange={handleStatusChange}
        onSavePatient={handleSavePatient}
        onMedicalNotesChange={(e) => setMedicalNotes(e.target.value)}
        onSaveMedicalNotes={handleSaveMedicalNotes}
      />

      {/* New Patient Dialog */}
      <NewPatientDialog
        open={isNewPatientDialogOpen}
        onClose={closeNewPatientDialog}
        onSave={handleSaveNewPatient}
        newPatient={newPatient}
        onChange={handleNewPatientChange}
      />
    </PageLayout>
  );
}
