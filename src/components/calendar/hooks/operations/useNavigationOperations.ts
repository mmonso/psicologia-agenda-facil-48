
import { addDays } from "date-fns";

interface NavigationOperationsProps {
  weekStart: Date;
  setCurrentDate: (date: Date) => void;
}

export function useNavigationOperations({
  weekStart,
  setCurrentDate,
}: NavigationOperationsProps) {
  const goToPreviousWeek = () => {
    setCurrentDate(addDays(weekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(weekStart, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  return {
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
}
