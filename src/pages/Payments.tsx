
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageLayout } from "@/components/layout/PageLayout";
import { payments, PaymentStatus } from "@/lib/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const getStatusDetails = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return {
        label: "Pago",
        variant: "default" as const,
        className: "bg-green-500",
      };
    case "pending":
      return {
        label: "Pendente",
        variant: "outline" as const,
      };
    case "overdue":
      return {
        label: "Atrasado",
        variant: "destructive" as const,
      };
    case "refunded":
      return {
        label: "Reembolsado",
        variant: "secondary" as const,
      };
    default:
      return {
        label: status,
        variant: "outline" as const,
      };
  }
};

// Interface for payment data
interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  notes: string;
}

// Interface for new payment form
interface NewPayment {
  patientId: string;
  patientName: string;
  date: Date;
  amount: number;
  status: PaymentStatus;
  method: string;
  notes: string;
}

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [localPayments, setLocalPayments] = useState<Payment[]>(payments);
  
  // New payment dialog
  const [isNewPaymentDialogOpen, setIsNewPaymentDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<NewPayment>({
    patientId: "",
    patientName: "",
    date: new Date(),
    amount: 0,
    status: "paid",
    method: "Pix",
    notes: ""
  });

  const filteredPayments = localPayments.filter((payment) => {
    const matchesSearch =
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    const matchesDate = !date || format(new Date(payment.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalAmount = sortedPayments.reduce((sum, payment) => {
    if (payment.status === "paid") {
      return sum + payment.amount;
    }
    return sum;
  }, 0);

  // Handle new payment dialog
  const handleOpenNewPaymentDialog = () => {
    setNewPayment({
      patientId: "",
      patientName: "",
      date: new Date(),
      amount: 0,
      status: "paid",
      method: "Pix",
      notes: ""
    });
    setIsNewPaymentDialogOpen(true);
  };

  const handleCloseNewPaymentDialog = () => {
    setIsNewPaymentDialogOpen(false);
  };

  const handleNewPaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "amount") {
      setNewPayment({
        ...newPayment,
        [name]: parseFloat(value) || 0
      });
    } else {
      setNewPayment({
        ...newPayment,
        [name]: value
      });
    }
  };

  const handleSaveNewPayment = () => {
    // Validate inputs
    if (!newPayment.patientName.trim()) {
      toast.error("Nome do paciente é obrigatório");
      return;
    }

    if (newPayment.amount <= 0) {
      toast.error("O valor deve ser maior que zero");
      return;
    }

    // Create new payment
    const newPaymentData: Payment = {
      id: `payment-${Date.now()}`,
      patientId: newPayment.patientId || `patient-${Date.now()}`,
      patientName: newPayment.patientName,
      date: newPayment.date.toISOString(),
      amount: newPayment.amount,
      status: newPayment.status,
      method: newPayment.method,
      notes: newPayment.notes
    };

    // Add to list
    setLocalPayments([...localPayments, newPaymentData]);
    
    // Close dialog and show toast
    handleCloseNewPaymentDialog();
    toast.success("Pagamento adicionado com sucesso!");
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <Button className="button-bounce" onClick={handleOpenNewPaymentDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Pagamento
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pagamentos..."
              className="w-full bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as PaymentStatus | "all")}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="overdue">Atrasados</SelectItem>
                <SelectItem value="refunded">Reembolsados</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-auto justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd/MM/yyyy")
                  ) : (
                    <span>Filtrar por data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={ptBR}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            {(statusFilter !== "all" || date || searchTerm) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStatusFilter("all");
                  setDate(undefined);
                  setSearchTerm("");
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPayments.length > 0 ? (
                sortedPayments.map((payment) => {
                  const statusDetails = getStatusDetails(payment.status);
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.patientName}
                      </TableCell>
                      <TableCell>
                        {format(new Date(payment.date), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        R$ {payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusDetails.variant}
                          className={cn(statusDetails.className)}
                        >
                          {statusDetails.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {payment.notes || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum pagamento encontrado.
                  </TableCell>
                </TableRow>
              )}
              {sortedPayments.length > 0 && (
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-medium">
                    Total
                  </TableCell>
                  <TableCell className="font-bold">
                    R$ {totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* New Payment Dialog */}
      <Dialog open={isNewPaymentDialogOpen} onOpenChange={setIsNewPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Pagamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patientName">Nome do Paciente</Label>
              <Input
                id="patientName"
                name="patientName"
                value={newPayment.patientName}
                onChange={handleNewPaymentChange}
                placeholder="Nome do paciente"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={newPayment.amount}
                onChange={handleNewPaymentChange}
                placeholder="0.00"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newPayment.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPayment.date ? (
                      format(newPayment.date, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={newPayment.date}
                    onSelect={(date) => setNewPayment({ ...newPayment, date: date || new Date() })}
                    initialFocus
                    locale={ptBR}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="method">Método de Pagamento</Label>
              <Select 
                name="method" 
                value={newPayment.method}
                onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                name="status" 
                value={newPayment.status}
                onValueChange={(value) => setNewPayment({ ...newPayment, status: value as PaymentStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status do pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                value={newPayment.notes}
                onChange={handleNewPaymentChange}
                placeholder="Observações sobre o pagamento"
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseNewPaymentDialog}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveNewPayment}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
