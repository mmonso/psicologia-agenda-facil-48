
// Data structures and types for the application
import { format, addDays, subDays, addMonths, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

// Patient status
export type PatientStatus = "active" | "inactive" | "waiting";

// Payment status
export type PaymentStatus = "paid" | "pending" | "overdue" | "refunded";

// Appointment status
export type AppointmentStatus = "scheduled" | "completed" | "canceled" | "no-show";

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: PatientStatus;
  startDate: Date;
  totalSessions: number;
  nextAppointment: Date | null;
  notes: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  notes: string;
  paid: boolean;
}

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  date: Date;
  status: PaymentStatus;
  appointmentId: string | null;
  method: string;
  notes: string;
}

// Initialize empty collections
export const patients: Patient[] = [];
export const appointments: Appointment[] = [];
export const payments: Payment[] = [];

// Month names in Portuguese
export const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Format date to Portuguese Brazil
export const formatDate = (date: Date, formatString: string = "P") => {
  return format(date, formatString, { locale: ptBR });
};

// Function to get month name
export const getMonthName = (date: Date) => {
  return monthNames[date.getMonth()];
};

// Calculate financial summary
export const getFinancialSummary = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const thisMonthPayments = payments.filter(p => {
    const paymentDate = new Date(p.date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });
  
  const lastMonthPayments = payments.filter(p => {
    const paymentDate = new Date(p.date);
    let month = currentMonth - 1;
    let year = currentYear;
    if (month < 0) {
      month = 11;
      year = currentYear - 1;
    }
    return paymentDate.getMonth() === month && 
           paymentDate.getFullYear() === year;
  });
  
  const thisMonthTotal = thisMonthPayments.reduce((sum, p) => 
    p.status === "paid" ? sum + p.amount : sum, 0);
  
  const lastMonthTotal = lastMonthPayments.reduce((sum, p) => 
    p.status === "paid" ? sum + p.amount : sum, 0);
  
  const pendingTotal = payments.filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  
  return {
    thisMonth: thisMonthTotal,
    lastMonth: lastMonthTotal,
    pending: pendingTotal,
    growth: lastMonthTotal ? (thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100 : 0
  };
};

// Generate appointment summary
export const getAppointmentSummary = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const todayAppointments = appointments.filter(a => {
    const appDate = new Date(a.date);
    return appDate.getDate() === today.getDate() &&
           appDate.getMonth() === today.getMonth() &&
           appDate.getFullYear() === today.getFullYear();
  });
  
  const upcomingAppointments = appointments.filter(a => {
    const appDate = new Date(a.date);
    return appDate > now && a.status === "scheduled";
  });
  
  const completedThisMonth = appointments.filter(a => {
    const appDate = new Date(a.date);
    return appDate.getMonth() === now.getMonth() &&
           appDate.getFullYear() === now.getFullYear() &&
           a.status === "completed";
  });
  
  const canceledThisMonth = appointments.filter(a => {
    const appDate = new Date(a.date);
    return appDate.getMonth() === now.getMonth() &&
           appDate.getFullYear() === now.getFullYear() &&
           (a.status === "canceled" || a.status === "no-show");
  });
  
  return {
    today: todayAppointments.length,
    upcoming: upcomingAppointments.length,
    completed: completedThisMonth.length,
    canceled: canceledThisMonth.length
  };
};

// Generate chart data for the last 6 months
export const getMonthlyData = () => {
  const result = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = monthNames[month.getMonth()].substring(0, 3);
    
    // Filter appointments for this month
    const monthAppointments = appointments.filter(a => {
      const appDate = new Date(a.date);
      return appDate.getMonth() === month.getMonth() &&
             appDate.getFullYear() === month.getFullYear();
    });
    
    // Filter payments for this month
    const monthPayments = payments.filter(p => {
      const payDate = new Date(p.date);
      return payDate.getMonth() === month.getMonth() &&
             payDate.getFullYear() === month.getFullYear() &&
             p.status === "paid";
    });
    
    const totalAppointments = monthAppointments.length;
    const totalRevenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
    
    result.push({
      name: monthName,
      consultations: totalAppointments,
      revenue: totalRevenue
    });
  }
  
  return result;
};
