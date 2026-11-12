import * as React from "react";

import { AppDialog } from "@/components/base/AppDialog";
import { Checkbox } from "@/components/base/Checkbox";
import { Label } from "@/components/base/Label";
import { RadioGroup, RadioGroupItem } from "@/components/base/RadioGroup";
import { Textarea } from "@/components/base/Textarea";
import type { Cliente, MotivoRechazo } from "@/services/documentos";

import { MOTIVO_LABEL } from "./labels";

type Datos = { motivo: MotivoRechazo; nota: string; pedirReemplazo: boolean };

type Props = {
  trigger: React.ReactNode;
  cliente?: Cliente;
  inicial?: Partial<Datos>;
  onConfirmar: (datos: Datos) => Promise<void>;
};

const MOTIVOS = Object.entries(MOTIVO_LABEL) as [MotivoRechazo, string][];

export function NoSirveDialog({ trigger, cliente, inicial, onConfirmar }: Props) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<{ motivo?: MotivoRechazo; nota: string; pedirReemplazo: boolean }>({
    nota: "",
    pedirReemplazo: true,
  });
  const [intentado, setIntentado] = React.useState(false);

  const abrir = (next: boolean) => {
    if (next) {
      setForm({
        motivo: inicial?.motivo,
        nota: inicial?.nota ?? "",
        pedirReemplazo: inicial?.pedirReemplazo ?? true,
      });
      setIntentado(false);
    }
    setOpen(next);
  };

  const faltaMotivo = !form.motivo;
  const faltaNota = form.motivo === "otro" && !form.nota.trim();

  return (
    <AppDialog
      open={open}
      onOpenChange={abrir}
      trigger={trigger}
      title="Marcar como no sirve"
      description="El motivo queda registrado en el documento y lo ve todo el equipo."
      confirmLabel="Marcar como no sirve"
      onConfirm={async () => {
        setIntentado(true);
        if (faltaMotivo || faltaNota || !form.motivo) return false;
        await onConfirmar({ motivo: form.motivo, nota: form.nota, pedirReemplazo: form.pedirReemplazo });
        return true;
      }}
    >
      <div className="space-y-5 pt-1">
        <fieldset className="space-y-2">
          <legend className="mb-2 type-supporting font-medium text-foreground">Motivo</legend>
          <RadioGroup
            value={form.motivo ?? ""}
            onValueChange={(v) => setForm((f) => ({ ...f, motivo: v as MotivoRechazo }))}
            aria-invalid={intentado && faltaMotivo}
            aria-describedby={intentado && faltaMotivo ? "motivo-error" : undefined}
          >
            {MOTIVOS.map(([value, label]) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={`motivo-${value}`} />
                <Label htmlFor={`motivo-${value}`} className="font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {intentado && faltaMotivo ? (
            <p id="motivo-error" className="type-meta text-destructive">
              Elige un motivo.
            </p>
          ) : null}
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="nota-rechazo">
            Nota {form.motivo === "otro" ? "" : <span className="text-muted-foreground">(opcional)</span>}
          </Label>
          <Textarea
            id="nota-rechazo"
            value={form.nota}
            onChange={(e) => setForm((f) => ({ ...f, nota: e.target.value }))}
            placeholder="Ej.: falta la segunda página del contrato"
            aria-invalid={intentado && faltaNota}
            aria-describedby={intentado && faltaNota ? "nota-error" : undefined}
          />
          {intentado && faltaNota ? (
            <p id="nota-error" className="type-meta text-destructive">
              Describe el motivo para que el cliente sepa qué enviar.
            </p>
          ) : null}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="pedir-reemplazo"
            checked={form.pedirReemplazo}
            onCheckedChange={(v) => setForm((f) => ({ ...f, pedirReemplazo: v === true }))}
            className="mt-0.5"
          />
          <div>
            <Label htmlFor="pedir-reemplazo" className="font-normal">
              Pedir al cliente que envíe otro documento
            </Label>
            <p className="type-meta text-muted-foreground">
              {cliente
                ? `Le escribiremos a ${cliente.correo} con el motivo y la nota.`
                : "Le escribiremos con el motivo y la nota."}
            </p>
          </div>
        </div>
      </div>
    </AppDialog>
  );
}
