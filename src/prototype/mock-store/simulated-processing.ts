/**
 * Simula, solo en el prototipo, lo que hará el servicio de resumen (IA) al
 * procesar un archivo recién subido: clasificarlo y devolver resumen + datos
 * clave. Determinista: depende solo del nombre del archivo.
 *
 * En producción esto lo hace el backend; este archivo se elimina junto con
 * `src/prototype/`.
 */
export type ProcesamientoSimulado = {
  tipoDocumento: string;
  resumen: string;
  datosClave: string;
};

const REGLAS: { patron: RegExp; resultado: ProcesamientoSimulado }[] = [
  {
    patron: /liquidaci/i,
    resultado: {
      tipoDocumento: "liquidacionSueldo",
      resumen:
        "Liquidación de sueldo mensual. Se identifican haberes imponibles, descuentos legales y el líquido a pago. No se detectan descuentos fuera de lo habitual.",
      datosClave: "Período: Octubre 2026\nLíquido a pago: $745.210\nImponible: $956.000",
    },
  },
  {
    patron: /contrato/i,
    resultado: {
      tipoDocumento: "contratoTrabajo",
      resumen:
        "Contrato de trabajo con jornada ordinaria y remuneración fija mensual. Identifica a las partes, el cargo y la fecha de inicio de la relación laboral.",
      datosClave: "Tipo de contrato: Plazo fijo\nInicio: 01-06-2025\nSueldo bruto: $850.000",
    },
  },
  {
    patron: /finiquito/i,
    resultado: {
      tipoDocumento: "finiquito",
      resumen:
        "Finiquito con detalle de montos pagados al término de la relación laboral. Revisar si se firmó con reserva de derechos.",
      datosClave: "Monto pagado: $1.020.000\nReserva de derechos: No detectada",
    },
  },
  {
    patron: /despido|carta/i,
    resultado: {
      tipoDocumento: "cartaDespido",
      resumen:
        "Carta de aviso de término de contrato. Indica la causal invocada y la fecha de término; conviene verificar si los hechos están descritos.",
      datosClave: "Causal: Art. 160 N°7\nTérmino efectivo: 30-10-2026",
    },
  },
  {
    patron: /cedula|carnet|ci_/i,
    resultado: {
      tipoDocumento: "cedulaIdentidad",
      resumen: "Imagen de cédula de identidad chilena. Se distinguen nombre, RUT y fecha de vencimiento.",
      datosClave: "Vigencia: Vigente hasta 2030",
    },
  },
  {
    patron: /ficha|epicrisis|clinic|medic/i,
    resultado: {
      tipoDocumento: "fichaMedica",
      resumen:
        "Documento clínico con antecedentes de atención, diagnóstico y tratamiento. Revisar tiempos entre ingreso, evaluación y procedimiento.",
      datosClave: "Diagnóstico: Por confirmar\nFecha de atención: 12-09-2026",
    },
  },
  {
    patron: /boleta|factura/i,
    resultado: {
      tipoDocumento: "boletaFactura",
      resumen: "Comprobante de pago. Se identifican emisor, fecha y monto total.",
      datosClave: "Monto total: $184.990",
    },
  },
];

const POR_DEFECTO: ProcesamientoSimulado = {
  tipoDocumento: "sinClasificar",
  resumen:
    "No se pudo identificar el tipo de documento con seguridad. Revisa el archivo y completa el resumen si corresponde.",
  datosClave: "",
};

export function simularProcesamiento(nombreArchivo: string): ProcesamientoSimulado {
  return REGLAS.find((regla) => regla.patron.test(nombreArchivo))?.resultado ?? POR_DEFECTO;
}
