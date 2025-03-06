
// Temporary mock data for development
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

// Generate mock patients
export const patients: Patient[] = [
  {
    id: "p1",
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    status: "active",
    startDate: subDays(new Date(), 60),
    totalSessions: 8,
    nextAppointment: addDays(new Date(), 3),
    notes: "Ansiedade e problemas de sono"
  },
  {
    id: "p2",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    phone: "(11) 91234-5678",
    status: "active",
    startDate: subDays(new Date(), 45),
    totalSessions: 6,
    nextAppointment: addDays(new Date(), 1),
    notes: "Depressão leve, respondendo bem ao tratamento"
  },
  {
    id: "p3",
    name: "Pedro Costa",
    email: "pedro.costa@example.com",
    phone: "(11) 99876-5432",
    status: "active",
    startDate: subDays(new Date(), 30),
    totalSessions: 4,
    nextAppointment: new Date(),
    notes: "Problemas de relacionamento, sessões quinzenais"
  },
  {
    id: "p4",
    name: "Ana Santos",
    email: "ana.santos@example.com",
    phone: "(11) 98888-7777",
    status: "inactive",
    startDate: subDays(new Date(), 120),
    totalSessions: 12,
    nextAppointment: null,
    notes: "Tratamento concluído com sucesso"
  },
  {
    id: "p5",
    name: "Carlos Ferreira",
    email: "carlos.ferreira@example.com",
    phone: "(11) 97777-8888",
    status: "waiting",
    startDate: addDays(new Date(), 7),
    totalSessions: 0,
    nextAppointment: addDays(new Date(), 7),
    notes: "Avaliação inicial agendada"
  }
];

// Generate today's and upcoming appointments
const today = new Date();
const createTime = (hours: number, minutes: number = 0) => {
  return setMinutes(setHours(new Date(), hours), minutes);
};

export const appointments: Appointment[] = [
  {
    id: "a1",
    patientId: "p3",
    patientName: "Pedro Costa",
    date: createTime(16, 30),
    duration: 50,
    status: "scheduled",
    notes: "Sessão regular",
    paid: false
  },
  {
    id: "a2",
    patientId: "p2",
    patientName: "Maria Oliveira",
    date: addDays(createTime(14), 1),
    duration: 50,
    status: "scheduled",
    notes: "Continuação da última sessão",
    paid: true
  },
  {
    id: "a3",
    patientId: "p1",
    patientName: "João Silva",
    date: addDays(createTime(10), 3),
    duration: 50,
    status: "scheduled",
    notes: "Foco em técnicas de relaxamento",
    paid: false
  },
  {
    id: "a4",
    patientId: "p5",
    patientName: "Carlos Ferreira",
    date: addDays(createTime(9), 7),
    duration: 80,
    status: "scheduled",
    notes: "Avaliação inicial",
    paid: true
  },
  {
    id: "a5",
    patientId: "p2",
    patientName: "Maria Oliveira",
    date: subDays(createTime(14, 30), 7),
    duration: 50,
    status: "completed",
    notes: "Relatou melhora significativa do humor",
    paid: true
  },
  {
    id: "a6",
    patientId: "p1",
    patientName: "João Silva",
    date: subDays(createTime(15), 3),
    duration: 50,
    status: "completed",
    notes: "Começou a praticar meditação regularmente",
    paid: true
  },
  {
    id: "a7",
    patientId: "p3",
    patientName: "Pedro Costa",
    date: subDays(createTime(11), 14),
    duration: 50,
    status: "no-show",
    notes: "Não compareceu, enviar lembrete na próxima vez",
    paid: false
  }
];

// Generate payment records
export const payments: Payment[] = [
  {
    id: "pay1",
    patientId: "p1",
    patientName: "João Silva",
    amount: 150,
    date: subDays(new Date(), 3),
    status: "paid",
    appointmentId: "a6",
    method: "Pix",
    notes: "Pagamento antecipado"
  },
  {
    id: "pay2",
    patientId: "p2",
    patientName: "Maria Oliveira",
    amount: 150,
    date: subDays(new Date(), 7),
    status: "paid",
    appointmentId: "a5",
    method: "Cartão de crédito",
    notes: ""
  },
  {
    id: "pay3",
    patientId: "p2",
    patientName: "Maria Oliveira",
    amount: 150,
    date: new Date(),
    status: "paid",
    appointmentId: "a2",
    method: "Transferência bancária",
    notes: "Incluído desconto de 10%"
  },
  {
    id: "pay4",
    patientId: "p5",
    patientName: "Carlos Ferreira",
    amount: 200,
    date: subDays(new Date(), 1),
    status: "paid",
    appointmentId: "a4",
    method: "Pix",
    notes: "Pagamento da avaliação inicial"
  },
  {
    id: "pay5",
    patientId: "p1",
    patientName: "João Silva",
    amount: 150,
    date: addDays(new Date(), 3),
    status: "pending",
    appointmentId: "a3",
    method: "Pendente",
    notes: "Pagamento será feito no dia da consulta"
  }
];

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
