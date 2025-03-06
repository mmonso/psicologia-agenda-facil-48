
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
};

const NavItem = ({ to, icon: Icon, label, end }: NavItemProps) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      cn(
        "sidebar-item group",
        isActive ? "sidebar-item-active" : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )
    }
  >
    <Icon className="w-5 h-5" />
    <span className="animate-fade-in">{label}</span>
  </NavLink>
);

export function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-sidebar shadow-sm transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 py-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold tracking-tight animate-fade-in">
            Psico Agenda
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2 px-2">
        <nav className="flex flex-col gap-1">
          <NavItem
            to="/"
            icon={LayoutDashboard}
            label="Dashboard"
            end
          />
          <NavItem
            to="/patients"
            icon={Users}
            label="Pacientes"
          />
          <NavItem
            to="/appointments"
            icon={Calendar}
            label="Consultas"
          />
          <NavItem
            to="/payments"
            icon={CreditCard}
            label="Pagamentos"
          />
          <NavItem
            to="/settings"
            icon={Settings}
            label="Configurações"
          />
        </nav>
      </div>
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-accent",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
}
