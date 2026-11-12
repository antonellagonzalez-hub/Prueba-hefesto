import { AlertTriangle, ExternalLink, FileImage, FileText, Pencil, Sparkles, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/base/Button";
import { Label } from "@/components/base/Label";
import { Separator } from "@/components/base/Separator";
import { Skeleton } from "@/components/base/Skeleton";
import { StatusDot } from "@/components/base/StatusDot";
import { Textarea } from "@/components/base/Textarea";
import { cn } from "@/lib/utils/cn";
import {
  type Cliente,
  type Documento,
  type MotivoRechazo,
  urlArchivoLocal,
} from "@/services/documentos";

import {
  ESTADO_LABEL,
  formatearFechaHora,
  formatearTamano,
  MOTIVO_LABEL,
  parsearDatosClave,
  TIPO_LABEL,
} from "./labels";
import { NoSirveDialog } from "./NoSirveDialog";

type Props = {
  documento: Documento;
  cliente?: Cliente;
  onCerrar?: () => void;
  onSirve: () => Promise<void>;
  onNoSirve: (datos: { motivo: MotivoRechazo; nota: string; pedirReemplazo: boolean }) => Promise<void>;
  onGuardarResumen: (resumen: string, datosClave: string) => Promise<void>;
  /** Título como heading de página (Sheet) o de región (panel fijo). */
  titleId?: string;
};

export function DocumentoPanel({
  documento: d,
  cliente,
  onCerrar,
  onSirve,
  onNoSirve,
  onGuardarResumen,
  titleId = "documento-titulo",
}: Props) {
  const [guardandoSirve, setGuardandoSirve] = React.useState(false);
  const estado = ESTADO_LABEL[d.estadoRevision];
  const procesando = d.estadoRevision === "procesando";

  const marcarSirve = async () => {
    setGuardandoSirve(true);
    try {
      await onSirve();
    } finally {
      setGuardandoSirve(false);
    }
  };

  const botonNoSirve = (label: string, variant: "outline" | "ghost" = "outline") => (
    <NoSirveDialog
      cliente={cliente}
      inicial={
        d.estadoRevision === "noSirve"
          ? { motivo: d.motivoRechazo, nota: d.notaRechazo ?? "", pedirReemplazo: d.reemplazoSolicitado }
          : undefined
      }
      onConfirmar={onNoSirve}
      trigger={
        <Button variant={variant} size="sm" disabled={procesando}>
          {label}
        </Button>
      }
    />
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Encabezado */}
      <header className="flex items-start gap-3 border-b border-border p-4">
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="break-words type-item-title text-foreground">
            {d.nombre}
          </h2>
          <p className="mt-0.5 type-meta text-muted-foreground">
            {TIPO_LABEL[d.tipoDocumento]} · {d.formato.toUpperCase()} · {formatearTamano(d.tamanoKb)}
          </p>
          <p className="type-meta text-muted-foreground">
            {cliente ? `${cliente.nombre} · ` : ""}Subido por {d.subidoPor}, {formatearFechaHora(d.subidoEn)}
          </p>
        </div>
        {onCerrar ? (
          <Button size="icon" variant="ghost" aria-label="Cerrar documento" onClick={onCerrar}>
            <X />
          </Button>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <VistaPrevia documento={d} />

        <ResumenSeccion key={d.id} documento={d} onGuardar={onGuardarResumen} />
      </div>

      {/* Decisión: siempre a la mano, al pie del panel */}
      <footer className="border-t border-border bg-surface-subtle p-4" aria-label="Decisión sobre el documento">
        {d.estadoRevision === "porRevisar" || procesando ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="type-supporting text-foreground">
              {procesando ? "Podrás decidir cuando termine el resumen." : "¿Sirve este documento?"}
            </p>
            <div className="flex gap-2">
              {botonNoSirve("No sirve")}
              <Button size="sm" onClick={marcarSirve} disabled={procesando} loading={guardandoSirve}>
                Sirve
              </Button>
            </div>
          </div>
        ) : null}

        {d.estadoRevision === "sirve" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <StatusDot tone={estado.tone}>{estado.label}</StatusDot>
              {d.revisadoPor && d.revisadoEn ? (
                <p className="mt-0.5 type-meta text-muted-foreground">
                  {d.revisadoPor}, {formatearFechaHora(d.revisadoEn)}
                </p>
              ) : null}
            </div>
            {botonNoSirve("Cambiar a no sirve", "ghost")}
          </div>
        ) : null}

        {d.estadoRevision === "noSirve" ? (
          <div className="space-y-3">
            <div>
              <StatusDot tone={estado.tone}>
                {estado.label}
                {d.motivoRechazo ? `: ${MOTIVO_LABEL[d.motivoRechazo].toLowerCase()}` : ""}
              </StatusDot>
              {d.notaRechazo ? <p className="mt-1 type-supporting text-foreground">{d.notaRechazo}</p> : null}
              <p className="mt-1 type-meta text-muted-foreground">
                {d.reemplazoSolicitado
                  ? `Se pidió un reemplazo a ${cliente?.correo ?? "el cliente"}.`
                  : "No se pidió reemplazo al cliente."}
                {d.revisadoPor && d.revisadoEn
                  ? ` ${d.revisadoPor}, ${formatearFechaHora(d.revisadoEn)}.`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {botonNoSirve("Editar motivo", "ghost")}
              <Button size="sm" variant="outline" onClick={marcarSirve} loading={guardandoSirve}>
                Cambiar a sirve
              </Button>
            </div>
          </div>
        ) : null}
      </footer>
    </div>
  );
}

function VistaPrevia({ documento: d }: { documento: Documento }) {
  const url = urlArchivoLocal(d.id);
  const esImagen = ["jpg", "jpeg", "png"].includes(d.formato);
  const Icono = esImagen ? FileImage : FileText;

  return (
    <section aria-label="Vista previa">
      <div className="relative overflow-hidden rounded-md border border-border bg-surface-muted">
        {url && esImagen ? (
          <img src={url} alt={`Vista previa de ${d.nombre}`} className="h-56 w-full object-contain" />
        ) : url && d.formato === "pdf" ? (
          <iframe src={url} title={`Vista previa de ${d.nombre}`} className="h-72 w-full bg-background" />
        ) : (
          <div className="flex h-40 flex-col items-center justify-center gap-2 px-4 text-center">
            <Icono className="size-8 text-muted-foreground" aria-hidden />
            <p className="type-meta text-muted-foreground">
              Vista previa disponible para los archivos que subas en esta sesión.
            </p>
          </div>
        )}
      </div>
      {url ? (
        <Button asChild size="sm" variant="ghost" className="mt-2">
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink /> Abrir en pestaña nueva
          </a>
        </Button>
      ) : null}
    </section>
  );
}

function ResumenSeccion({
  documento: d,
  onGuardar,
}: {
  documento: Documento;
  onGuardar: (resumen: string, datosClave: string) => Promise<void>;
}) {
  const [editando, setEditando] = React.useState(false);
  const [borrador, setBorrador] = React.useState({ resumen: "", datosClave: "" });
  const [guardando, setGuardando] = React.useState(false);
  const datos = parsearDatosClave(d.datosClave);

  if (d.estadoRevision === "procesando") {
    return (
      <section aria-labelledby="resumen-titulo" aria-busy="true">
        <h3 id="resumen-titulo" className="mb-2 type-supporting font-medium text-foreground">
          Resumen
        </h3>
        <p className="mb-3 flex items-center gap-1.5 type-meta text-muted-foreground" aria-live="polite">
          <Sparkles className="size-3.5 animate-pulse" aria-hidden /> Generando resumen…
        </p>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </section>
    );
  }

  const guardar = async () => {
    setGuardando(true);
    try {
      await onGuardar(borrador.resumen.trim(), borrador.datosClave.trim());
      setEditando(false);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section aria-labelledby="resumen-titulo">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h3 id="resumen-titulo" className="type-supporting font-medium text-foreground">
            Resumen
          </h3>
          <p className="flex items-center gap-1 type-meta text-muted-foreground">
            {d.resumenEditado ? (
              <>
                <Pencil className="size-3" aria-hidden /> Corregido por el equipo
              </>
            ) : (
              <>
                <Sparkles className="size-3" aria-hidden /> Generado automáticamente · verifícalo con el
                documento
              </>
            )}
          </p>
        </div>
        {!editando ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setBorrador({ resumen: d.resumen ?? "", datosClave: d.datosClave ?? "" });
              setEditando(true);
            }}
          >
            <Pencil /> Editar
          </Button>
        ) : null}
      </div>

      {editando ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="editar-resumen">Resumen</Label>
            <Textarea
              id="editar-resumen"
              rows={5}
              value={borrador.resumen}
              onChange={(e) => setBorrador((b) => ({ ...b, resumen: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="editar-datos">Datos clave</Label>
            <Textarea
              id="editar-datos"
              rows={5}
              value={borrador.datosClave}
              onChange={(e) => setBorrador((b) => ({ ...b, datosClave: e.target.value }))}
              aria-describedby="editar-datos-ayuda"
              className="font-mono text-xs"
            />
            <p id="editar-datos-ayuda" className="type-meta text-muted-foreground">
              Un dato por línea, con el formato «Etiqueta: valor».
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={guardar} loading={guardando} loadingLabel="Guardando…">
              Guardar resumen
            </Button>
          </div>
        </div>
      ) : (
        <>
          {d.resumen ? (
            <p className="type-body text-foreground">{d.resumen}</p>
          ) : (
            <p className="type-supporting text-muted-foreground">Sin resumen. Usa «Editar» para escribirlo.</p>
          )}

          {datos.length > 0 ? (
            <>
              <Separator className="my-4" />
              <h3 className="mb-2 type-supporting font-medium text-foreground">Datos clave</h3>
              <dl className="space-y-1.5">
                {datos.map(({ etiqueta, valor }, i) => {
                  const alerta = etiqueta.toLowerCase() === "alerta";
                  return (
                    <div
                      key={i}
                      className={cn(
                        "grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 type-supporting",
                        alerta && "rounded-control bg-warning/10 px-2 py-1.5",
                      )}
                    >
                      <dt
                        className={cn(
                          "flex items-start gap-1 text-muted-foreground",
                          alerta && "font-medium text-warning-strong",
                        )}
                      >
                        {alerta ? <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden /> : null}
                        {etiqueta || "Dato"}
                      </dt>
                      <dd className={cn("text-foreground", alerta && "font-medium")}>{valor}</dd>
                    </div>
                  );
                })}
              </dl>
            </>
          ) : null}
        </>
      )}
    </section>
  );
}
