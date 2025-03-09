
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
    // Create full Patient type for storage
    const newPatientData: Patient = {
      id: `patient-${Date.now()}`,
      name: "",
      email: "",
      phone: "",
      status: "active",
      startDate: new Date(),
      totalSessions: 0,
      nextAppointment: null,
      notes: "",
    };

    if (!newPatientData.name.trim()) {
      toast({
        description: "Nome do paciente é obrigatório",
      });
      return;
    }

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
      description: `${newPatientData.name} foi adicionado com sucesso.`,
    });
    
    setSelectedPatientId(newPatientData.id);
  };

  return {
    saveNewPatient,
  };
}
