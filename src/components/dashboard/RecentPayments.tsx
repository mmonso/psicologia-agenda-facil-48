
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BanknoteIcon, CheckCircle2, Clock, XCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { payments, PaymentStatus } from "@/lib/data";

const getPaymentStatusDetails = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return {
        label: "Pago",
        variant: "success" as const,
        icon: CheckCircle2,
      };
    case "pending":
      return {
        label: "Pendente",
        variant: "warning" as const,
        icon: Clock,
      };
    case "overdue":
      return {
        label: "Atrasado",
        variant: "destructive" as const,
        icon: XCircle,
      };
    case "refunded":
      return {
        label: "Reembolsado",
        variant: "outline" as const,
        icon: BanknoteIcon,
      };
    default:
      return {
        label: status,
        variant: "outline" as const,
        icon: Clock,
      };
  }
};

export function RecentPayments() {
  // Sort payments by date and take the most recent ones
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="hover-card-effect">
      <CardHeader>
        <CardTitle>Pagamentos Recentes</CardTitle>
        <CardDescription>
          Últimos pagamentos recebidos ou pendentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPayments.map((payment) => {
            const statusDetails = getPaymentStatusDetails(payment.status);
            const StatusIcon = statusDetails.icon;
            
            return (
              <div key={payment.id} className="animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{payment.patientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(payment.date), "PPP", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">
                        R$ {payment.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payment.method}
                      </div>
                    </div>
                    <Badge
                      variant={
                        statusDetails.variant === "success"
                          ? "default"
                          : statusDetails.variant
                      }
                      className={cn(
                        "flex items-center gap-1",
                        statusDetails.variant === "success" && "bg-green-500"
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusDetails.label}
                    </Badge>
                  </div>
                </div>
                {payment.id !== recentPayments[recentPayments.length - 1].id && (
                  <Separator className="my-4" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
