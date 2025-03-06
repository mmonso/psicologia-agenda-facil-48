
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isToday } from "date-fns";

interface CalendarHeaderProps {
  weekDays: Date[];
  weekStart: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
}

export default function CalendarHeader({
  weekDays,
  weekStart,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek
}: CalendarHeaderProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Agenda Semanal</h2>
          <p className="text-sm text-muted-foreground">
            {format(weekStart, "'Semana de' dd 'de' MMMM", { locale: ptBR })} a{" "}
            {format(addDays(weekStart, 6), "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPreviousWeek} className="button-bounce">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Semana anterior</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onCurrentWeek} className="button-bounce">
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={onNextWeek} className="button-bounce">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima semana</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-1">
        <div className="h-12"></div>
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-md font-medium",
              isToday(day) && "bg-primary/10 text-primary"
            )}
          >
            <div className="text-xs text-muted-foreground uppercase">
              {format(day, "EEE", { locale: ptBR })}
            </div>
            <div className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full",
              isToday(day) && "bg-primary text-primary-foreground"
            )}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
