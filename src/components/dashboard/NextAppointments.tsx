
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, User } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { appointments } from "@/lib/data";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function NextAppointments() {
  // Filter and sort upcoming appointments
  const upcomingAppointments = appointments
    .filter(
      (appointment) => 
        appointment.status === "scheduled" && 
        new Date(appointment.date) >= new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <Card className="hover-card-effect">
      <CardHeader>
        <CardTitle>Próximas Consultas</CardTitle>
        <CardDescription>
          Consultas agendadas para os próximos dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(appointment.patientName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{appointment.patientName}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>
                        {format(new Date(appointment.date), "PPp", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="button-bounce">
                  Detalhes
                </Button>
              </div>
              {appointment.id !== upcomingAppointments[upcomingAppointments.length - 1].id && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
          {upcomingAppointments.length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
              <User className="h-8 w-8 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">Sem consultas agendadas</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Não há consultas agendadas para os próximos dias.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
