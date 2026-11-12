# Sidebar

Primitivas internas (estilo shadcn) que usa `AppSidebar` por debajo. **No las compongas a mano para una barra de navegación: usa `AppSidebar`** (data-driven). Recurre a estas primitivas solo para layouts a medida.

## Cuándo usarlo

Primitivas internas para layouts laterales a medida (como la navegación de este showcase). Para la barra de navegación estándar de una app usa `AppSidebar` — estas piezas son el motor que corre debajo.

## Composición

Kit completo estilo shadcn: `SidebarProvider` (estado), `Sidebar`, `SidebarHeader`/`SidebarContent`/`SidebarFooter`, grupos (`SidebarGroup*`), menús (`SidebarMenu*`), `SidebarTrigger` para colapsar y `SidebarInset` para el área de contenido.

## Vía recomendada: AppSidebar

Para una barra de navegación, **no** uses estas primitivas directamente. Describe la navegación como datos y deja que `AppSidebar` arme la composición correcta:

```tsx
<SidebarProvider>
  <AppSidebar groups={groups} user={user} logo={<Logo />} />
  <SidebarInset>{/* contenido */}</SidebarInset>
</SidebarProvider>
```

Lee `AppSidebar.md` para el modelo de datos (`groups`, `items`, `user`).

## Cuándo SÍ usar las primitivas

Solo para shells o composiciones a medida que no encajan en el modelo `groups` de `AppSidebar`:
`SidebarProvider`, `SidebarInset`, `SidebarTrigger` para el armazón; y `SidebarGroup`, `SidebarMenu`, `SidebarMenuButton`, etc. si necesitas una estructura totalmente custom.

## Reglas

- Para navegación estándar → `AppSidebar`. No mezcles primitivas sueltas con `AppSidebar` en la misma barra.
- No insertes piezas sueltas como `SidebarSeparator` dentro de una barra hecha con `AppSidebar`.
- Si el caso es a medida, mantén un solo enfoque (todo primitivas) y documenta por qué no usaste `AppSidebar`.

## Previews embebidos

Si montas una segunda sidebar como demo dentro de una aplicación que ya tiene
la suya, desactiva sus efectos globales para que no comparta la cookie ni el
atajo de teclado con el shell anfitrión:

```tsx
<SidebarProvider persistState={false} keyboardShortcut={false}>
  {/* preview */}
</SidebarProvider>
```

## Cuándo NO usar (directamente)

- **Barra de navegación normal** → `AppSidebar`.
- **Layout de app con header + sidebar** → `SidebarProvider` + `AppSidebar` + `SidebarInset` (ver AppSidebar.md).

## Import

```tsx
// Para el armazón/contenedor (caso a medida):
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/base/Sidebar";
```

## Exports

Contenedor: `Sidebar`, `SidebarProvider`, `SidebarInset`, `SidebarTrigger`, `SidebarRail`, `useSidebar`.
Estructura: `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarSeparator`, `SidebarInput`.
Menú: `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`.

## Para IA

1. Por defecto, NO uses estas primitivas: usa `AppSidebar` y su prop `groups`.
2. Usa `SidebarProvider`/`SidebarInset`/`SidebarTrigger` solo como armazón cuando un layout a medida lo exija.
3. Si compones a mano, no mezcles con `AppSidebar`; documenta la decisión.
