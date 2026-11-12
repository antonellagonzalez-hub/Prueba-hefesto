import { definePrototypeDataContract, type FieldSpec } from "./data-contract-schema";

/**
 * Fuente de verdad de los datos usados por el prototipo.
 *
 * El designer describe el producto en lenguaje natural; el agente mantiene este
 * contrato y ejecuta `pnpm check:data-contract` antes de implementar la UI.
 */

const DESK = "Desk de documentos";

type FieldInput = Pick<FieldSpec, "id" | "productDescription" | "dataType" | "required"> & {
  usage?: Partial<FieldSpec["usage"]>;
  enumValues?: string[];
  derivation?: string;
  reference?: string;
  origin?: FieldSpec["origin"];
  classification?: FieldSpec["dataClassification"];
  tiNote?: string;
};

/**
 * Atajo para declarar campos. Nada de este desk está confirmado aún por TI:
 * todo queda `pendingTi` con una nota de qué validar.
 */
const field = (input: FieldInput): FieldSpec => ({
  id: input.id,
  productDescription: input.productDescription,
  dataType: input.dataType,
  required: input.required,
  usage: {
    visible: true,
    editable: false,
    calculated: false,
    technical: false,
    ...input.usage,
  },
  usedIn: [DESK],
  ...(input.enumValues ? { enumValues: input.enumValues } : {}),
  ...(input.derivation ? { derivation: input.derivation } : {}),
  origin: input.origin ?? "productAssumption",
  source: input.reference
    ? { kind: "lexyEntity", reference: input.reference }
    : { kind: "unknown" },
  dataClassification: input.classification ?? "internal",
  technicalValidation: {
    status: "pendingTi",
    note: input.tiNote ?? "Confirmar que el dato existe en backend y su nombre real.",
  },
});

export const ESTADOS_REVISION = ["procesando", "porRevisar", "sirve", "noSirve"] as const;

export const MOTIVOS_RECHAZO = [
  "ilegible",
  "vencido",
  "noCorresponde",
  "incompleto",
  "duplicado",
  "otro",
] as const;

export const TIPOS_DOCUMENTO = [
  "contratoTrabajo",
  "finiquito",
  "cartaDespido",
  "liquidacionSueldo",
  "cedulaIdentidad",
  "certificado",
  "fichaMedica",
  "boletaFactura",
  "contratoCredito",
  "sinClasificar",
] as const;

export const prototypeDataContract = definePrototypeDataContract({
  contractVersion: "1",
  project: {
    name: "pruebahefesto",
    description:
      "Desk CRM para acumular, revisar y resumir los documentos de los clientes de Lexy.",
  },
  entities: {
    cliente: {
      id: "cliente",
      productDescription: "Persona representada por Lexy, dueña de una carpeta de documentos.",
      roleInExperience: "Agrupa los documentos como carpeta y da contexto al revisar.",
      usedIn: [DESK],
      origin: "productAssumption",
      source: { kind: "lexyEntity", reference: "cliente" },
      dataClassification: "sensitive",
      technicalValidation: {
        status: "pendingTi",
        note: "Confirmar entidad cliente y campos expuestos al CRM.",
      },
      fields: {
        id: field({
          id: "id",
          productDescription: "Identificador del cliente.",
          dataType: "identifier",
          required: true,
          usage: { visible: false, technical: true },
          reference: "cliente.id_cliente",
        }),
        nombre: field({
          id: "nombre",
          productDescription: "Nombre completo del cliente.",
          dataType: "string",
          required: true,
          usage: { filterable: true, sortable: true },
          reference: "cliente.nombre_completo",
          classification: "sensitive",
        }),
        rut: field({
          id: "rut",
          productDescription: "RUT del cliente; permite buscarlo.",
          dataType: "string",
          required: true,
          usage: { filterable: true },
          reference: "cliente.rut_cliente",
          classification: "sensitive",
        }),
        materia: field({
          id: "materia",
          productDescription: "Materia del caso del cliente (despido, deuda, etc.).",
          dataType: "string",
          required: true,
          reference: "caso.materia",
          tiNote: "Un cliente puede tener varios casos: confirmar qué materia mostrar.",
        }),
        correo: field({
          id: "correo",
          productDescription: "Correo al que se envía la solicitud de reemplazo.",
          dataType: "string",
          required: true,
          reference: "cliente.email",
          classification: "sensitive",
        }),
      },
    },
    documento: {
      id: "documento",
      productDescription: "Archivo subido por el equipo a la carpeta de un cliente.",
      roleInExperience: "Unidad que se revisa: se previsualiza, se resume y se marca si sirve.",
      usedIn: [DESK],
      origin: "generatedByUsability",
      source: { kind: "unknown" },
      dataClassification: "sensitive",
      technicalValidation: {
        status: "pendingTi",
        note: "Definir almacenamiento de archivos y entidad documento en backend.",
      },
      fields: {
        id: field({
          id: "id",
          productDescription: "Identificador del documento.",
          dataType: "identifier",
          required: true,
          usage: { visible: false, technical: true },
          tiNote:
            "En el prototipo el id se genera al subir; confirmar si lo asigna el backend.",
        }),
        clienteId: field({
          id: "clienteId",
          productDescription: "Cliente dueño del documento (carpeta).",
          dataType: "identifier",
          required: true,
          usage: { visible: false, technical: true, filterable: true },
        }),
        nombre: field({
          id: "nombre",
          productDescription: "Nombre del archivo tal como se subió.",
          dataType: "string",
          required: true,
          usage: { filterable: true, sortable: true },
        }),
        tipoDocumento: field({
          id: "tipoDocumento",
          productDescription: "Clasificación del documento, detectada al procesarlo.",
          dataType: "enum",
          required: true,
          enumValues: [...TIPOS_DOCUMENTO],
          origin: "generatedByUsability",
          tiNote: "La clasificación sale del procesamiento automático: confirmar catálogo.",
        }),
        formato: field({
          id: "formato",
          productDescription: "Extensión del archivo (pdf, jpg, docx…).",
          dataType: "string",
          required: true,
        }),
        tamanoKb: field({
          id: "tamanoKb",
          productDescription: "Peso del archivo en KB.",
          dataType: "number",
          required: true,
        }),
        subidoEn: field({
          id: "subidoEn",
          productDescription: "Fecha y hora de carga.",
          dataType: "datetime",
          required: true,
          usage: { sortable: true },
        }),
        subidoPor: field({
          id: "subidoPor",
          productDescription: "Persona del equipo que subió el documento.",
          dataType: "string",
          required: true,
        }),
        estadoRevision: field({
          id: "estadoRevision",
          productDescription: "Etapa del documento: procesando, por revisar, sirve o no sirve.",
          dataType: "enum",
          required: true,
          enumValues: [...ESTADOS_REVISION],
          usage: { editable: true, filterable: true },
          origin: "generatedByUsability",
        }),
        resumen: field({
          id: "resumen",
          productDescription: "Resumen automático del documento; el equipo puede editarlo.",
          dataType: "string",
          required: false,
          usage: { editable: true },
          origin: "generatedByUsability",
          tiNote: "Definir servicio de resumen (IA), tiempo de respuesta y dónde se guarda.",
        }),
        datosClave: field({
          id: "datosClave",
          productDescription:
            "Datos más importantes extraídos (partes, fechas, montos), una línea «Etiqueta: valor» por dato.",
          dataType: "string",
          required: false,
          usage: { editable: true },
          origin: "generatedByUsability",
          tiNote: "Confirmar formato de los datos extraídos por el servicio de resumen.",
        }),
        resumenEditado: field({
          id: "resumenEditado",
          productDescription: "Indica que una persona corrigió el resumen automático.",
          dataType: "boolean",
          required: false,
          origin: "generatedByUsability",
        }),
        motivoRechazo: field({
          id: "motivoRechazo",
          productDescription: "Por qué el documento no sirve.",
          dataType: "enum",
          required: false,
          enumValues: [...MOTIVOS_RECHAZO],
          usage: { editable: true },
          origin: "generatedByUsability",
        }),
        notaRechazo: field({
          id: "notaRechazo",
          productDescription: "Detalle libre del motivo; obligatorio si el motivo es «otro».",
          dataType: "string",
          required: false,
          usage: { editable: true },
          origin: "generatedByUsability",
        }),
        reemplazoSolicitado: field({
          id: "reemplazoSolicitado",
          productDescription: "Se le pidió al cliente que envíe un documento de reemplazo.",
          dataType: "boolean",
          required: false,
          usage: { editable: true },
          origin: "generatedByUsability",
          tiNote: "Definir canal de la solicitud (correo, portal) y quién la envía.",
        }),
        revisadoPor: field({
          id: "revisadoPor",
          productDescription: "Quién tomó la decisión sirve / no sirve.",
          dataType: "string",
          required: false,
          origin: "generatedByUsability",
        }),
        revisadoEn: field({
          id: "revisadoEn",
          productDescription: "Cuándo se tomó la decisión.",
          dataType: "datetime",
          required: false,
          origin: "generatedByUsability",
        }),
      },
    },
  },
  relations: [
    {
      id: "clienteDocumentos",
      fromEntity: "cliente",
      toEntity: "documento",
      cardinality: "oneToMany",
      productDescription: "Cada cliente tiene una carpeta con sus documentos.",
      requiredBy: [DESK],
      resolution: "queried",
      origin: "generatedByUsability",
      source: { kind: "unknown" },
      dataClassification: "internal",
      technicalValidation: {
        status: "pendingTi",
        note: "Confirmar si los documentos cuelgan del cliente o del caso.",
      },
    },
  ],
});
