
import { ReactNode } from "react";
import { SideBar } from "./SideBar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />
      <div className="flex flex-1 flex-col ml-[250px]">
        <Header />
        <main className={cn("flex-1 p-6", className)}>
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
