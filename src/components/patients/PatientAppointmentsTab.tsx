
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/data";
import { Patient, Appointment } from "@/lib/data";

interface PatientAppointmentsTabProps {
  patientAppointments: Appointment[];
}

export function PatientAppointmentsTab({ patientAppointments }: PatientAppointmentsTabProps) {
  return (
    <div className="pt-4">
      {patientAppointments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <User className="mx-auto h-10 w-10 mb-2 opacity-20" />
          <p>Nenhuma sessão registrada para este paciente.</p>
          <Button className="mt-4" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Agendar sessão
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Histórico de sessões</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Agendar sessão
            </Button>
          </div>
          
          <div className="space-y-3">
            {patientAppointments
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((appointment) => {
                const statusMap = {
                  scheduled: {
                    label: "Agendada",
                    className: "bg-primary"
                  },
                  completed: {
                    label: "Realizada",
                    className: "bg-green-500"
                  },
                  canceled: {
                    label: "Cancelada",
                    className: "bg-destructive"
                  },
                  "no-show": {
                    label: "Não compareceu",
                    className: "bg-amber-500"
                  }
                };
                
                return (
                  <Card key={appointment.id} className="hover-card-effect">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">
                            {formatDate(appointment.date, "dd 'de' MMMM 'de' yyyy")} às{" "}
                            {formatDate(appointment.date, "HH:mm")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.notes}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              appointment.paid 
                                ? "bg-green-500 text-white" 
                                : "bg-amber-500 text-white"
                            )}
                          >
                            {appointment.paid ? "Pago" : "Pendente"}
                          </Badge>
                          <Badge
                            className={cn(statusMap[appointment.status]?.className)}
                          >
                            {statusMap[appointment.status]?.label}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
