import type {
  ESTADOS_REVISION,
  MOTIVOS_RECHAZO,
  TIPOS_DOCUMENTO,
} from "@/prototype/data-contract/prototype-data-contract";
import { simularProcesamiento } from "@/prototype/mock-store/simulated-processing";
import { read, write } from "@/prototype/ports";

export type EstadoRevision = (typeof ESTADOS_REVISION)[number];
export type MotivoRechazo = (typeof MOTIVOS_RECHAZO)[number];
export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number];

export type Cliente = {
  id: string;
  nombre: string;
  rut: string;
  materia: string;
  correo: string;
};

export type Documento = {
  id: string;
  clienteId: string;
  nombre: string;
  tipoDocumento: TipoDocumento;
  formato: string;
  tamanoKb: number;
  subidoEn: string;
  subidoPor: string;
  estadoRevision: EstadoRevision;
  resumen?: string;
  datosClave?: string;
  resumenEditado?: boolean;
  motivoRechazo?: MotivoRechazo;
  notaRechazo?: string;
  reemplazoSolicitado?: boolean;
  revisadoPor?: string;
  revisadoEn?: string;
};

/** Persona en sesión. En producción viene de la autenticación. */
export const USUARIO_ACTUAL = "Javiera Morales";

const IS_PROTOTYPE = import.meta.env.VITE_LEXY_PROTOTYPE !== "false";

/** Vistas previas de archivos subidos en esta sesión (no se persisten). */
const archivosLocales = new Map<string, string>();
export const urlArchivoLocal = (documentoId: string) => archivosLocales.get(documentoId);

export function cargarClientes() {
  return read.load<Cliente[]>("clientesConDocumentos", undefined, {
    description: "Clientes que forman las carpetas del desk",
    trigger: "Al entrar al desk de documentos",
    reads: {
      entities: ["cliente"],
      fields: ["cliente.id", "cliente.nombre", "cliente.rut", "cliente.materia", "cliente.correo"],
    },
  });
}

export function cargarDocumentos() {
  return read.load<Documento[]>("documentosDelDesk", undefined, {
    description: "Documentos de todos los clientes con su estado y resumen",
    trigger: "Al entrar al desk y después de cada cambio",
    reads: {
      entities: ["documento"],
      fields: [
        "documento.id",
        "documento.clienteId",
        "documento.nombre",
        "documento.tipoDocumento",
        "documento.formato",
        "documento.tamanoKb",
        "documento.subidoEn",
        "documento.subidoPor",
        "documento.estadoRevision",
        "documento.resumen",
        "documento.datosClave",
        "documento.resumenEditado",
        "documento.motivoRechazo",
        "documento.notaRechazo",
        "documento.reemplazoSolicitado",
        "documento.revisadoPor",
        "documento.revisadoEn",
      ],
    },
  });
}

const formatoDe = (nombre: string) => nombre.split(".").pop()?.toLowerCase() ?? "";

/**
 * Sube archivos a la carpeta de un cliente. Quedan «procesando» hasta que el
 * servicio de resumen responde; en el prototipo esa respuesta se simula.
 */
export async function subirDocumentos(
  clienteId: string,
  archivos: File[],
  onProcesado?: () => void,
) {
  const ahora = new Date().toISOString();
  const ids: string[] = [];

  for (const [indice, archivo] of archivos.entries()) {
    const id = `doc-${Date.now()}-${indice}`;
    ids.push(id);
    archivosLocales.set(id, URL.createObjectURL(archivo));
    await write.publish(
      "documentoSubido",
      {
        id,
        clienteId,
        nombre: archivo.name,
        tipoDocumento: "sinClasificar",
        formato: formatoDe(archivo.name),
        tamanoKb: Math.max(1, Math.round(archivo.size / 1024)),
        subidoEn: ahora,
        subidoPor: USUARIO_ACTUAL,
        estadoRevision: "procesando",
        resumenEditado: false,
        reemplazoSolicitado: false,
      },
      {
        description: "El equipo sube un documento a la carpeta del cliente",
        trigger: "Botón «Subir» del diálogo de carga",
        writes: {
          entities: ["documento"],
          fields: [
            "documento.clienteId",
            "documento.nombre",
            "documento.tipoDocumento",
            "documento.formato",
            "documento.tamanoKb",
            "documento.subidoEn",
            "documento.subidoPor",
            "documento.estadoRevision",
          ],
        },
      },
    );
  }

  if (IS_PROTOTYPE) {
    // El backend procesa el archivo y publica el resultado; aquí se simula.
    window.setTimeout(async () => {
      for (const [indice, archivo] of archivos.entries()) {
        const resultado = simularProcesamiento(archivo.name);
        await write.publish(
          "documentoProcesado",
          { id: ids[indice], ...resultado, estadoRevision: "porRevisar" },
          {
            description: "El servicio de resumen clasifica y resume el documento",
            trigger: "Automático, al terminar de procesar el archivo",
            writes: {
              entities: ["documento"],
              fields: [
                "documento.tipoDocumento",
                "documento.resumen",
                "documento.datosClave",
                "documento.estadoRevision",
              ],
            },
          },
        );
      }
      onProcesado?.();
    }, 3500);
  }
}

export function marcarSirve(documentoId: string) {
  return write.publish(
    "documentoMarcadoSirve",
    {
      id: documentoId,
      estadoRevision: "sirve",
      motivoRechazo: null,
      notaRechazo: null,
      reemplazoSolicitado: false,
      revisadoPor: USUARIO_ACTUAL,
      revisadoEn: new Date().toISOString(),
    },
    {
      description: "Se marca que el documento sirve",
      trigger: "Botón «Sirve» del panel del documento",
      writes: {
        entities: ["documento"],
        fields: [
          "documento.estadoRevision",
          "documento.motivoRechazo",
          "documento.notaRechazo",
          "documento.reemplazoSolicitado",
          "documento.revisadoPor",
          "documento.revisadoEn",
        ],
      },
    },
  );
}

export function marcarNoSirve(
  documentoId: string,
  datos: { motivo: MotivoRechazo; nota: string; pedirReemplazo: boolean },
) {
  return write.publish(
    "documentoMarcadoNoSirve",
    {
      id: documentoId,
      estadoRevision: "noSirve",
      motivoRechazo: datos.motivo,
      notaRechazo: datos.nota.trim() || null,
      reemplazoSolicitado: datos.pedirReemplazo,
      revisadoPor: USUARIO_ACTUAL,
      revisadoEn: new Date().toISOString(),
    },
    {
      description: "Se marca que el documento no sirve y, opcionalmente, se pide un reemplazo",
      trigger: "Botón «Marcar como no sirve» del diálogo de motivo",
      writes: {
        entities: ["documento"],
        fields: [
          "documento.estadoRevision",
          "documento.motivoRechazo",
          "documento.notaRechazo",
          "documento.reemplazoSolicitado",
          "documento.revisadoPor",
          "documento.revisadoEn",
        ],
      },
    },
  );
}

export function guardarResumen(documentoId: string, resumen: string, datosClave: string) {
  return write.publish(
    "resumenEditado",
    { id: documentoId, resumen, datosClave, resumenEditado: true },
    {
      description: "El equipo corrige el resumen automático",
      trigger: "Botón «Guardar resumen» del panel del documento",
      writes: {
        entities: ["documento"],
        fields: ["documento.resumen", "documento.datosClave", "documento.resumenEditado"],
      },
    },
  );
}
