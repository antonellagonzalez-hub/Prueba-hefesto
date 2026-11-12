import { Plus } from "lucide-react";

import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/base/Pagination";
import { StatusDot } from "@/components/base/StatusDot";
import { Table } from "@/components/base/Table";

// Receta CRM — desk con tabla y acciones: ancho completo, toolbar con búsqueda
// y acción primaria, tabla densa con estado por fila, paginación al pie.
// Bajo md: la tabla densa pasa a lista y la toolbar apila (pauta §5).
// Ver crm-desk.md.

export function CasosDesk() {
  return (
    <main className="w-full p-4">
      <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="type-subsection-title text-foreground">Casos</h1>
          <p className="type-supporting text-muted-foreground">24 activos · 3 vencen hoy</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Input
            className="h-9 w-full sm:w-64"
            placeholder="Buscar por cliente o RUT"
            aria-label="Buscar casos"
          />
          <Button size="sm">
            <Plus /> Nuevo caso
          </Button>
        </div>
      </header>

      {/* Patrón §5: la tabla densa pasa a lista bajo md — misma información,
          detalle secundario colapsado, sin scroll horizontal a ciegas. */}
      <ul className="space-y-2 md:hidden" aria-label="Casos">
        <li className="rounded-md border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="type-item-title text-foreground">María Pérez</p>
            <StatusDot tone="warning">En revisión</StatusDot>
          </div>
          <p className="mt-1 type-supporting text-muted-foreground">Despido</p>
          <p className="mt-1 type-data text-warning-strong">Vence hoy</p>
        </li>
        <li className="rounded-md border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="type-item-title text-foreground">Juan Soto</p>
            <StatusDot tone="success">Al día</StatusDot>
          </div>
          <p className="mt-1 type-supporting text-muted-foreground">Deuda</p>
          <p className="mt-1 type-data text-muted-foreground">12 días</p>
        </li>
      </ul>

      <div className="hidden md:block">
        <Table columns="2fr 1.5fr 1fr 1fr" stickyHeader>
          <Table.Header>
            <Table.Cell>Cliente</Table.Cell>
            <Table.Cell>Materia</Table.Cell>
            <Table.Cell>Estado</Table.Cell>
            <Table.Cell>Plazo</Table.Cell>
          </Table.Header>
          <Table.Content>
            <Table.Row onClick={() => {}}>
              <Table.Cell className="type-item-title text-foreground">María Pérez</Table.Cell>
              <Table.Cell>Despido</Table.Cell>
              <Table.Cell>
                <StatusDot tone="warning">En revisión</StatusDot>
              </Table.Cell>
              <Table.Cell className="type-data text-warning-strong">Vence hoy</Table.Cell>
            </Table.Row>
            <Table.Row onClick={() => {}}>
              <Table.Cell className="type-item-title text-foreground">Juan Soto</Table.Cell>
              <Table.Cell>Deuda</Table.Cell>
              <Table.Cell>
                <StatusDot tone="success">Al día</StatusDot>
              </Table.Cell>
              <Table.Cell className="type-data text-muted-foreground">12 días</Table.Cell>
            </Table.Row>
          </Table.Content>
        </Table>
      </div>

      <footer className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="type-supporting text-muted-foreground">Mostrando 1–20 de 64 casos</p>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </footer>
    </main>
  );
}
