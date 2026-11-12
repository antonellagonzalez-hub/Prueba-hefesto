import { FileText, Upload, X } from "lucide-react";
import * as React from "react";

import { AppDialog } from "@/components/base/AppDialog";
import { Button } from "@/components/base/Button";
import { Label } from "@/components/base/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base/Select";
import { cn } from "@/lib/utils/cn";
import type { Cliente } from "@/services/documentos";

import { formatearTamano,FORMATOS_ACEPTADOS } from "./labels";

const MAX_MB = 20;

type Props = {
  trigger: React.ReactNode;
  clientes: Cliente[];
  clientePreseleccionado?: string;
  onSubir: (clienteId: string, archivos: File[]) => Promise<void>;
};

export function SubirDocumentosDialog({ trigger, clientes, clientePreseleccionado, onSubir }: Props) {
  const [open, setOpen] = React.useState(false);
  const [clienteId, setClienteId] = React.useState<string>();
  const [archivos, setArchivos] = React.useState<File[]>([]);
  const [arrastrando, setArrastrando] = React.useState(false);
  const [intentado, setIntentado] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const abrir = (next: boolean) => {
    if (next) {
      setClienteId(clientePreseleccionado);
      setArchivos([]);
      setIntentado(false);
    }
    setOpen(next);
  };

  const agregar = (lista: FileList | null) => {
    if (!lista) return;
    setArchivos((prev) => {
      const nombres = new Set(prev.map((a) => a.name));
      return [...prev, ...Array.from(lista).filter((a) => !nombres.has(a.name))];
    });
  };

  const demasiadoGrandes = archivos.filter((a) => a.size > MAX_MB * 1024 * 1024);
  const faltaCliente = !clienteId;
  const faltanArchivos = archivos.length === 0;

  return (
    <AppDialog
      open={open}
      onOpenChange={abrir}
      trigger={trigger}
      title="Subir documentos"
      description="Se resumen automáticamente al subirlos. Quedan «Por revisar» en la carpeta del cliente."
      confirmLabel={archivos.length > 1 ? `Subir ${archivos.length} documentos` : "Subir"}
      className="sm:max-w-lg"
      onConfirm={async () => {
        setIntentado(true);
        if (faltaCliente || faltanArchivos || demasiadoGrandes.length > 0 || !clienteId) return false;
        await onSubir(clienteId, archivos);
        return true;
      }}
    >
      <div className="space-y-5 pt-1">
        <div className="space-y-2">
          <Label htmlFor="subir-cliente">Cliente</Label>
          <Select value={clienteId} onValueChange={setClienteId}>
            <SelectTrigger
              id="subir-cliente"
              className="w-full"
              aria-invalid={intentado && faltaCliente}
              aria-describedby={intentado && faltaCliente ? "subir-cliente-error" : undefined}
            >
              <SelectValue placeholder="Elige la carpeta del cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nombre} · {c.rut}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {intentado && faltaCliente ? (
            <p id="subir-cliente-error" className="type-meta text-destructive">
              Elige a qué cliente pertenecen los documentos.
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <span className="type-supporting font-medium text-foreground" id="zona-archivos-label">
            Archivos
          </span>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setArrastrando(true);
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArrastrando(false);
              agregar(e.dataTransfer.files);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong px-4 py-6 text-center transition-colors",
              arrastrando && "border-primary bg-accent",
              intentado && faltanArchivos && "border-destructive",
            )}
          >
            <Upload className="size-5 text-muted-foreground" aria-hidden />
            <p className="type-supporting text-foreground">Arrastra los archivos aquí</p>
            <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
              Elegir archivos
            </Button>
            <p className="type-meta text-muted-foreground">PDF, JPG, PNG o Word · hasta {MAX_MB} MB cada uno</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={FORMATOS_ACEPTADOS}
              className="sr-only"
              aria-labelledby="zona-archivos-label"
              onChange={(e) => {
                agregar(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
          {intentado && faltanArchivos ? (
            <p className="type-meta text-destructive">Agrega al menos un archivo.</p>
          ) : null}

          {archivos.length > 0 ? (
            <ul className="divide-y divide-border rounded-md border border-border" aria-label="Archivos por subir">
              {archivos.map((a) => {
                const grande = a.size > MAX_MB * 1024 * 1024;
                return (
                  <li key={a.name} className="flex items-center gap-2 px-3 py-2">
                    <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate type-supporting text-foreground">{a.name}</span>
                      <span className={cn("type-meta", grande ? "text-destructive" : "text-muted-foreground")}>
                        {grande
                          ? `Pesa ${formatearTamano(Math.round(a.size / 1024))}: supera los ${MAX_MB} MB`
                          : formatearTamano(Math.max(1, Math.round(a.size / 1024)))}
                      </span>
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={`Quitar ${a.name}`}
                      onClick={() => setArchivos((prev) => prev.filter((p) => p !== a))}
                    >
                      <X />
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </AppDialog>
  );
}
