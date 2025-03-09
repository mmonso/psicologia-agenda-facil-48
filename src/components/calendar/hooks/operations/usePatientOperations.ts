
import { toast } from "sonner";
import type { Patient, NewPatient } from "../../utils";

export function usePatientOperations(
  patients: Patient[],
  setPatients: (patients: Patient[]) => void,
  setNewPatient: (patient: NewPatient) => void,
  setIsNewPatientDialogOpen: (isOpen: boolean) => void,
  setSelectedPatientId: (id: string) => void,
) {
  const saveNewPatient = () => {
    // Create new patient with NewPatient type for the form
    const newPatient: NewPatient = {
      name: "",
      email: "",
      phone: "",
      notes: ""
    };

    if (!newPatient.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do paciente é obrigatório",
      });
      return;
    }

    // Create full Patient type for storage
    const newPatientData: Patient = {
      id: `patient-${Date.now()}`,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      status: "active",
      startDate: new Date(),
      totalSessions: 0,
      nextAppointment: null,
      notes: newPatient.notes,
    };

    const updatedPatients = [...patients, newPatientData];
    setPatients(updatedPatients);
    
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      notes: ""
    });
    
    setIsNewPatientDialogOpen(false);
    
    toast({
      title: "Paciente adicionado",
      description: `${newPatientData.name} foi adicionado com sucesso.`,
    });
    
    setSelectedPatientId(newPatientData.id);
  };

  return {
    saveNewPatient,
  };
}
