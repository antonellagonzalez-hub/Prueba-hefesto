# crm-desk — block

Desk de trabajo para **CRM**: ancho completo, toolbar con búsqueda y acción primaria, tabla densa y escaneable con estado por fila, y paginación al pie. Instálalo con `create-lexy add crm-desk` — trae `Table`, `StatusDot`, `Pagination`, `Input` y `Button`. La vista queda en tu proyecto (`views/CasosDesk.tsx`): edítala con libertad.

## Montaje

Vive dentro del layout de aplicación (`crm-app-layout`), en el `SidebarInset`. Reemplaza las filas de ejemplo por tus datos y conecta `onClick` de cada fila a la navegación al detalle (`crm-detalle-caso`).

## Adaptación

- El subtítulo del header resume el estado del desk (_"24 activos · 3 vencen hoy"_): cámbialo por tus métricas reales.
- Los cuatro estados de datos son obligatorios: loading (`Skeleton` con la forma de la tabla), vacío y error (`Empty` con salida), contenido.
- Columnas vía `columns` (grid-template-columns); el estado por fila siempre con `StatusDot` + texto.

## Evita

Envolver cada fila en una card, espaciado de cliente, color como único signo de estado, y listas de cientos de filas sin `Pagination`.

## Degradación móvil

Bajo `md` la tabla pasa a lista (un `li` por caso con `StatusDot`); la toolbar apila y la búsqueda es full-width. Si agregas columnas, decide cuáles sobreviven en la lista móvil: prioriza identidad, estado y plazo. Evita el scroll horizontal como única respuesta.
