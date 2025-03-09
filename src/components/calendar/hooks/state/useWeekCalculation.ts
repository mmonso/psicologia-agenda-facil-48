
import { useMemo } from "react";
import { addDays, startOfWeek } from "date-fns";

export function useWeekCalculation(currentDate: Date) {
  const weekStart = useMemo(() => {
    // Use weekStartsOn: 0 for Sunday
    return startOfWeek(currentDate, { weekStartsOn: 0 });
  }, [currentDate]);
  
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => addDays(weekStart, index));
  }, [weekStart]);

  return { weekStart, weekDays };
}
