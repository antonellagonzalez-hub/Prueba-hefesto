import { FileText, FolderKanban, Settings } from "lucide-react";
import * as React from "react";

import { AppSidebar } from "@/components/base/AppSidebar";
import { Logo } from "@/components/base/Logo";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/base/Sidebar";

// Receta CRM — layout de aplicación: navegación lateral colapsable data-driven
// y área de trabajo. Las vistas del desk y el detalle viven dentro de
// SidebarInset. En móvil el sidebar vive en un Sheet (lo maneja el
// componente) y un header solo-móvil expone el trigger. Ver crm-app-layout.md.

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar
        logo={<Logo layout="horizontal" />}
        groups={[
          {
            label: "Trabajo",
            items: [
              { title: "Documentos", icon: FileText, url: "/", isActive: true },
              { title: "Casos", icon: FolderKanban, url: "/casos" },
            ],
          },
          {
            label: "Sistema",
            items: [{ title: "Configuración", icon: Settings, url: "/config" }],
          },
        ]}
      />
      <SidebarInset className="h-svh min-h-0 overflow-hidden">
        {/* Header solo-móvil: bajo md el sidebar es un Sheet y necesita un
            trigger visible (pauta §5: no escondas acciones frecuentes). */}
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-margin-mobile md:hidden">
          <SidebarTrigger aria-label="Abrir navegación" />
          <Logo layout="horizontal" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
