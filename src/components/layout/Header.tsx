
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/":
      return "Dashboard";
    case "/patients":
      return "Pacientes";
    case "/appointments":
      return "Consultas";
    case "/payments":
      return "Pagamentos";
    case "/settings":
      return "Configurações";
    default:
      return "Dashboard";
  }
};

export function Header() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setPageTitle(getPageTitle(location.pathname));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/90 px-6 backdrop-blur transition-shadow duration-200",
        isScrolled && "shadow-sm"
      )}
    >
      <h1 className="text-xl font-semibold">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-64 rounded-full bg-background pl-8 focus-visible:ring-primary"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 animate-scale-in">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Nova consulta agendada</p>
                  <p className="text-sm text-muted-foreground">
                    João Silva agendou uma consulta para amanhã às 14:00
                  </p>
                  <p className="text-xs text-muted-foreground">Há 5 minutos</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Pagamento recebido</p>
                  <p className="text-sm text-muted-foreground">
                    Recebimento confirmado: R$ 150,00 - Maria Oliveira
                  </p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Lembrete</p>
                  <p className="text-sm text-muted-foreground">
                    Próxima consulta: Pedro Costa - Hoje às 16:30
                  </p>
                  <p className="text-xs text-muted-foreground">Há 3 horas</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center font-medium text-primary">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
