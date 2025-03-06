
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonthlyData } from "@/lib/data";

export function RevenueChart() {
  const data = getMonthlyData();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(0)}`;
  };

  return (
    <Card className="hover-card-effect">
      <CardHeader>
        <CardTitle>Receitas e Consultas</CardTitle>
        <CardDescription>
          Comparativo dos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false} 
              />
              <YAxis 
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "revenue") {
                    return [`R$ ${Number(value).toFixed(2)}`, "Receita"];
                  }
                  return [value, "Consultas"];
                }}
              />
              <Legend 
                formatter={(value) => {
                  if (value === "revenue") return "Receita";
                  if (value === "consultations") return "Consultas";
                  return value;
                }}
              />
              <Bar 
                yAxisId="left"
                dataKey="revenue" 
                name="revenue"
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
              <Bar 
                yAxisId="right"
                dataKey="consultations" 
                name="consultations"
                fill="hsl(var(--accent-foreground) / 0.3)" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
