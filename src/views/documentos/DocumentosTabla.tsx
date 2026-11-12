import { FileImage, FileText, type LucideIcon } from "lucide-react";

import { StatusDot } from "@/components/base/StatusDot";
import { Table } from "@/components/base/Table";
import { cn } from "@/lib/utils/cn";
import type { Cliente, Documento } from "@/services/documentos";

import { ESTADO_LABEL, formatearFecha, TIPO_LABEL } from "./labels";

const iconoDe = (formato: string): LucideIcon =>
  ["jpg", "jpeg", "png"].includes(formato) ? FileImage : FileText;

type Props = {
  documentos: Documento[];
  clientesPorId: Record<string, Cliente>;
  mostrarCliente: boolean;
  seleccionadoId?: string;
  onAbrir: (id: string) => void;
};

export function DocumentosTabla({
  documentos,
  clientesPorId,
  mostrarCliente,
  seleccionadoId,
  onAbrir,
}: Props) {
  return (
    <>
      {/* Móvil: lista con la misma información, sin scroll horizontal. */}
      <ul className="space-y-2 md:hidden" aria-label="Documentos">
        {documentos.map((d) => {
          const Icono = iconoDe(d.formato);
          const estado = ESTADO_LABEL[d.estadoRevision];
          return (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => onAbrir(d.id)}
                className="flex w-full items-start gap-3 rounded-md border border-border bg-card p-3 text-left"
              >
                <Icono className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate type-item-title text-foreground">{d.nombre}</span>
                  <span className="block truncate type-meta text-muted-foreground">
                    {TIPO_LABEL[d.tipoDocumento]}
                    {mostrarCliente ? ` · ${clientesPorId[d.clienteId]?.nombre ?? ""}` : ""}
                  </span>
                  <span className="mt-1 flex items-center justify-between gap-2">
                    <StatusDot tone={estado.tone}>{estado.label}</StatusDot>
                    <span className="type-meta text-muted-foreground">{formatearFecha(d.subidoEn)}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="hidden md:block">
        <Table columns={mostrarCliente ? "minmax(0,2.4fr) minmax(0,1.4fr) 0.8fr 1fr" : "minmax(0,3fr) 0.8fr 1fr"}>
          <Table.Header>
            <Table.Cell>Documento</Table.Cell>
            {mostrarCliente ? <Table.Cell>Cliente</Table.Cell> : null}
            <Table.Cell>Subido</Table.Cell>
            <Table.Cell>Estado</Table.Cell>
          </Table.Header>
          <Table.Content>
            {documentos.map((d) => {
              const Icono = iconoDe(d.formato);
              const estado = ESTADO_LABEL[d.estadoRevision];
              const activo = d.id === seleccionadoId;
              return (
                <Table.Row
                  key={d.id}
                  onClick={() => onAbrir(d.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onAbrir(d.id);
                    }
                  }}
                  tabIndex={0}
                  aria-selected={activo}
                  className={cn("cursor-pointer", activo && "bg-accent")}
                >
                  <Table.Cell className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <Icono className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div className="min-w-0">
                        <p className="truncate type-item-title text-foreground">{d.nombre}</p>
                        <p className="truncate type-meta text-muted-foreground">
                          {TIPO_LABEL[d.tipoDocumento]}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>
                  {mostrarCliente ? (
                    <Table.Cell className="min-w-0 truncate">
                      {clientesPorId[d.clienteId]?.nombre}
                    </Table.Cell>
                  ) : null}
                  <Table.Cell className="type-data text-muted-foreground">
                    {formatearFecha(d.subidoEn)}
                  </Table.Cell>
                  <Table.Cell>
                    <StatusDot tone={estado.tone}>{estado.label}</StatusDot>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Content>
        </Table>
      </div>
    </>
  );
}
