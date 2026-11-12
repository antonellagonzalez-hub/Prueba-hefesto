# Contexto de este proyecto

> **Para agentes de IA:** lee este archivo al comenzar cada sesión de diseño y
> mantenlo al día. Es la memoria del proyecto: captura una sola vez lo que el
> diseñador ya decidió, para no volver a preguntarlo en cada sesión.
>
> - Si una sección dice _Por definir_, **pregunta** lo que necesites en la
>   primera tarea que lo requiera y **escribe aquí la respuesta**.
> - Cuando el diseñador tome una decisión de alcance, audiencia o referencia
>   («esto es para clientes», «usa este Figma», «sin login por ahora»),
>   **regístrala aquí** en una línea.
> - Mantén el archivo corto (una pantalla). Esto no es documentación: es el
>   brief vivo del proyecto.
>
> Lo técnico no va aquí: `architecture`, `world`, `addons` y rutas viven en
> `.lexy` (fuente de verdad técnica, no la dupliques).

## Qué estamos construyendo

<!-- Una o dos frases: qué es este producto y qué problema resuelve. -->

Desk de documentos tipo drive: el equipo acumula los documentos de cada cliente, los revisa, decide si sirven y lee un resumen con lo más importante.

## Para quién es

<!-- Quién lo usa y en qué situación. Si .lexy trae world=mixto, aquí se
     aclara qué partes son cliente y cuáles CRM. -->

CRM — equipo Lexy (abogados/analistas) que revisa documentos de clientes.

## Pantallas y flujos clave

<!-- Lista corta de las vistas que importan, con su objetivo. Ej:
     - Intake de antecedentes (cliente): que la persona entregue sus datos con calma.
     - Desk de casos (CRM): que el abogado vea estado y plazos de un vistazo. -->

- Desk de documentos (CRM): subir, ver por cliente, marcar si sirve o no y leer el resumen.

## Datos principales

<!-- Resumen humano, no catálogo técnico:
     - Objetos principales que existen en la experiencia.
     - Datos que la persona necesita ver o modificar.
     - Supuestos que todavía debe validar TI.

     La fuente estructurada de entidades, campos, relaciones, estados y
     vive en:
     src/prototype/data-contract/prototype-data-contract.ts
     No dupliques aquí el detalle del contrato. -->

- Cliente: carpeta de documentos (nombre, RUT, materia, correo).
- Documento: archivo, tipo, estado de revisión, resumen y datos clave (IA), motivo de rechazo y si se pidió reemplazo.
- Pendiente con TI: servicio de resumen, almacenamiento de archivos y canal para pedir reemplazos.

## Referencias

<!-- Links de Figma, capturas o productos de referencia que mandan sobre
     composiciones genéricas. Indica qué parte del proyecto cubre cada una. -->

Ninguna registrada.

## Decisiones y restricciones

<!-- Decisiones ya tomadas que un agente no debe re-litigar, y límites del
     encargo. Una línea por decisión, con fecha si ayuda. -->

- Proyecto generado con `create-lexy` el 2026-11-12 con el nombre `pruebahefesto`.
- 2026-11-12: el desk de documentos es CRM; los documentos los sube el equipo (no el cliente).
- 2026-11-12: «No sirve» exige motivo y permite pedir al cliente un reemplazo.
- 2026-11-12: el resumen se genera automático (IA) al subir y el equipo puede editarlo.
- 2026-11-12: desk de documentos en 3 zonas: carpetas por cliente · tabla con filtro por estado · panel del documento (vista previa, resumen editable, decisión al pie). Bajo 1280px el panel es un Sheet.
