import type { EstadoRevision, MotivoRechazo, TipoDocumento } from "@/services/documentos";

type Tone = "gray" | "brand" | "success" | "warning" | "danger" | "info";

export const ESTADO_LABEL: Record<EstadoRevision, { label: string; tone: Tone }> = {
  procesando: { label: "Procesando", tone: "gray" },
  porRevisar: { label: "Por revisar", tone: "warning" },
  sirve: { label: "Sirve", tone: "success" },
  noSirve: { label: "No sirve", tone: "danger" },
};

export const MOTIVO_LABEL: Record<MotivoRechazo, string> = {
  ilegible: "Ilegible o de mala calidad",
  incompleto: "Incompleto (faltan páginas o partes)",
  vencido: "Vencido o desactualizado",
  noCorresponde: "No corresponde a este caso",
  duplicado: "Duplicado",
  otro: "Otro motivo",
};

export const TIPO_LABEL: Record<TipoDocumento, string> = {
  contratoTrabajo: "Contrato de trabajo",
  finiquito: "Finiquito",
  cartaDespido: "Carta de despido",
  liquidacionSueldo: "Liquidación de sueldo",
  cedulaIdentidad: "Cédula de identidad",
  certificado: "Certificado",
  fichaMedica: "Ficha médica",
  boletaFactura: "Boleta o factura",
  contratoCredito: "Pagaré o crédito",
  sinClasificar: "Sin clasificar",
};

export type FiltroEstado = "todos" | "porRevisar" | "sirve" | "noSirve";

export const FILTROS: { value: FiltroEstado; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "porRevisar", label: "Por revisar" },
  { value: "sirve", label: "Sirve" },
  { value: "noSirve", label: "No sirve" },
];

const fechaCorta = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short" });
const fechaHora = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatearFecha = (iso: string) => fechaCorta.format(new Date(iso));
export const formatearFechaHora = (iso: string) => fechaHora.format(new Date(iso));

export const formatearTamano = (kb: number) =>
  kb >= 1024 ? `${(kb / 1024).toLocaleString("es-CL", { maximumFractionDigits: 1 })} MB` : `${kb} KB`;

/** "Etiqueta: valor" por línea → pares para una lista de definición. */
export const parsearDatosClave = (texto?: string) =>
  (texto ?? "")
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean)
    .map((linea) => {
      const corte = linea.indexOf(":");
      return corte === -1
        ? { etiqueta: "", valor: linea }
        : { etiqueta: linea.slice(0, corte).trim(), valor: linea.slice(corte + 1).trim() };
    });

export const FORMATOS_ACEPTADOS = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
