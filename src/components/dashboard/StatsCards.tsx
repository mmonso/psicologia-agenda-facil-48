
import { 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: number;
  className?: string;
}

function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("hover-card-effect overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary">
          <Icon className="h-full w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          {trend !== undefined && (
            <>
              <div
                className={cn(
                  "mr-1",
                  trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-muted-foreground"
                )}
              >
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </div>
              <div>em relação ao mês anterior</div>
            </>
          )}
          {description && <div>{description}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Consultas Hoje"
        value="2"
        description="2 agendadas, 0 canceladas"
        icon={Calendar}
      />
      <StatCard
        title="Total de Pacientes"
        value="24"
        description="3 novos este mês"
        icon={Users}
      />
      <StatCard
        title="Receita Mensal"
        value="R$ 3.450"
        trend={12.5}
        icon={CreditCard}
      />
      <StatCard
        title="Pagamentos Pendentes"
        value="R$ 750"
        description="5 pagamentos"
        icon={TrendingUp}
      />
    </div>
  );
}
