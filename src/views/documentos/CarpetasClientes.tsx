import { Folder, FolderOpen } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base/Select";
import { cn } from "@/lib/utils/cn";
import type { Cliente } from "@/services/documentos";

export const TODOS = "todos";

type Props = {
  clientes: Cliente[];
  porRevisar: Record<string, number>;
  totales: Record<string, number>;
  seleccionado: string;
  onSeleccionar: (clienteId: string) => void;
};

/** Carpetas por cliente: columna en desktop, select en móvil/tablet. */
export function CarpetasClientes({
  clientes,
  porRevisar,
  totales,
  seleccionado,
  onSeleccionar,
}: Props) {
  const totalGeneral = Object.values(totales).reduce((a, b) => a + b, 0);
  const pendientesGeneral = Object.values(porRevisar).reduce((a, b) => a + b, 0);

  const carpetas = [
    { id: TODOS, nombre: "Todos los clientes", detalle: "", total: totalGeneral, pendientes: pendientesGeneral },
    ...clientes.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      detalle: c.materia,
      total: totales[c.id] ?? 0,
      pendientes: porRevisar[c.id] ?? 0,
    })),
  ];

  return (
    <>
      <div className="lg:hidden">
        <Select value={seleccionado} onValueChange={onSeleccionar}>
          <SelectTrigger aria-label="Carpeta de cliente" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {carpetas.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nombre} ({c.total})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <nav aria-label="Carpetas de clientes" className="hidden w-60 shrink-0 lg:block">
        <h2 className="mb-2 px-2 type-meta text-muted-foreground">Clientes</h2>
        <ul className="space-y-0.5">
          {carpetas.map((c) => {
            const activo = c.id === seleccionado;
            const Icono = activo ? FolderOpen : Folder;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSeleccionar(c.id)}
                  aria-current={activo ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-control px-2 py-2 text-left transition-colors",
                    "hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    activo && "bg-accent text-accent-foreground",
                  )}
                >
                  <Icono
                    className={cn("mt-0.5 size-4 shrink-0", activo ? "text-primary" : "text-muted-foreground")}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate type-supporting font-medium text-foreground">
                      {c.nombre}
                    </span>
                    {c.detalle ? (
                      <span className="block truncate type-meta text-muted-foreground">{c.detalle}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 type-meta text-muted-foreground tabular-nums">
                    {c.pendientes > 0 ? (
                      <span className="font-medium text-warning-strong">
                        {c.pendientes}
                        <span className="sr-only"> por revisar de</span>
                      </span>
                    ) : null}
                    {c.pendientes > 0 ? <span aria-hidden> / </span> : null}
                    {c.total}
                    <span className="sr-only"> documentos</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
