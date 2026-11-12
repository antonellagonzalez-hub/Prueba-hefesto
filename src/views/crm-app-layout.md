# crm-app-layout — block

Estructura persistente de la app interna (**CRM**): navegación lateral colapsable data-driven (`AppSidebar`) y área de trabajo (`SidebarInset`). Instálalo con `create-lexy add crm-app-layout` — trae `AppSidebar`, `Sidebar` y `Logo`. La vista queda en tu proyecto (`views/AppLayout.tsx`): edítala con libertad.

## Montaje

Envuelve tus rutas internas; el contenido (desk, detalle) se renderiza como `children`:

```tsx
<AppLayout>
  <CasosDesk />
</AppLayout>
```

## Adaptación

- La navegación se describe como datos en `groups` (lee `AppSidebar.md` antes de tocarla; no compongas a mano las primitivas de `Sidebar`).
- Marca el ítem activo con `isActive` desde tu router.
- Pie de usuario: pasa `user={{ name, email, avatar }}` a `AppSidebar`.

## Evita

Usar este layout en pantallas de cliente sin panel lateral (ahí va `AppHeaderBar` + secciones) y duplicar el logo dentro del contenido.

## Degradación móvil

En móvil el sidebar vive en un `Sheet` (lo maneja el componente `Sidebar`) y aparece un header solo-móvil (`md:hidden`) con `SidebarTrigger` y logo. No escondas la navegación: el trigger queda siempre visible.
