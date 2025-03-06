import { AppointmentStatus } from "@/lib/data";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  duration: number;
  status: AppointmentStatus;
  notes: string;
  paid: boolean;
  isRecurring?: boolean;
}

export interface AvailableSlot {
  day: number; // 0-6 (segunda a domingo)
  time: string; // formato "HH:MM"
}

export interface NewPatient {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", 
  "18:00", "19:00", "20:00", "21:00", "22:00"
];

export const getStatusDetails = (status: AppointmentStatus) => {
  switch (status) {
    case "scheduled":
      return {
        label: "Agendada",
        variant: "default" as const,
        className: "bg-primary",
      };
    case "completed":
      return {
        label: "Realizada",
        variant: "outline" as const,
        className: "bg-green-500",
      };
    case "canceled":
      return {
        label: "Cancelada",
        variant: "destructive" as const,
      };
    case "no-show":
      return {
        label: "Não compareceu",
        variant: "destructive" as const,
        className: "bg-amber-500",
      };
    default:
      return {
        label: status,
        variant: "outline" as const,
      };
  }
};

export const createRecurringAppointments = (baseAppointment: Appointment) => {
  // Create appointments for the next 8 weeks
  const recurringAppointments = [];
  
  for (let i = 1; i <= 8; i++) {
    const futureDate = new Date(baseAppointment.date);
    futureDate.setDate(futureDate.getDate() + (i * 7)); // Add weeks
    
    recurringAppointments.push({
      ...baseAppointment,
      id: `${baseAppointment.id}-week-${i}`,
      date: futureDate,
      isRecurring: true
    });
  }
  
  return recurringAppointments;
};
