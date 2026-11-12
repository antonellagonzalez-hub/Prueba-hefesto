# AppSidebar

Barra lateral de navegación **data-driven**. Describes la navegación como datos
(`groups`, `user`, `logo`) y el componente compone internamente las primitivas
de `Sidebar`. **Esta es la vía a usar para construir sidebars.** No compongas a
mano las primitivas de `Sidebar` (`SidebarGroup`, `SidebarMenuButton`, etc.) ni
insertes piezas sueltas (`SidebarSeparator`…): `AppSidebar` ya arma la
composición correcta.

## Cuándo usarlo

Para la navegación lateral de una app interna descrita como datos: grupos, items, iconos, badges y estado activo sin componer primitivas a mano. Es la vía por defecto del layout CRM; colapsable y responsive (Sheet en móvil).

## Composición

Una sola pieza data-driven (`AppSidebar`) que arma por debajo las primitivas de `Sidebar`: recibe grupos e items (título, url, icono, badge, subitems) y resuelve colapso, estado activo y variante móvil. El área de trabajo va en `SidebarInset`.

## Layout canónico

`AppSidebar` vive dentro de `SidebarProvider`, junto a `SidebarInset` para el
contenido. El botón de colapso lo aporta `AppSidebar` **dentro** de su cabecera
(expandida); cuando está colapsada, renderiza un `SidebarTrigger` **fuera** (en
el contenido) para reabrirla. Solo aparece si `collapsible !== "none"`.

```tsx
import { useState } from "react";

export function AppLayout() {
  const [open, setOpen] = useState(true);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar
        collapsible="offcanvas"
        logo={<Logo layout="horizontal" />}
        logoIcon={<Logo layout="isotipe" className="size-7" />}
        groups={groups}
        user={{ name: "Ada Lovelace", email: "ada@lexy.cl", avatar: "/avatar.jpg" }}
      />
      <SidebarInset>
        {!open && (
          <div className="p-4">
            <SidebarTrigger /> {/* reabrir cuando está colapsada */}
          </div>
        )}
        <main>{/* contenido */}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

## Anchos — cuándo usar cada uno

El ancho lo controla `--sidebar-width`. El **default es Estándar (16rem / 256px)**:
es el punto resonante del sistema (4× el rail de 64px y 4:1 de contenido a
1280px) y el estándar de la industria. Cubre labels de navegación con contador
sin truncar. Para cambiarlo, pásalo por `style` en `SidebarProvider`:

```tsx
<SidebarProvider style={{ "--sidebar-width": "17.5rem" } as React.CSSProperties}>
```

| Preset                 | Valor             | Cuándo usarlo                                                                                                                                                            |
| ---------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Compacta**           | `14rem` (224px)   | Apps operacionales densas; priorizas área de contenido. Justo para labels ≤20 car.                                                                                       |
| **Estándar** ← default | `16rem` (256px)   | Navegación con iconos y contadores. La elección por defecto para casi todo.                                                                                              |
| **Cómoda**             | `17.5rem` (280px) | Labels largos, o un subtítulo/rol bajo cada ítem.                                                                                                                        |
| **Workspace**          | `20rem` (320px)   | La barra es un panel de trabajo: switcher de organización, búsqueda embebida o árbol de navegación. En `lg` (1024px) ocupa ~31% — audita que lo justifique el contenido. |

Regla: elige por lo que **es** la barra, no por estética. Navegación → Estándar;
panel-workspace → Workspace. Los intermedios resuelven casos de contenido puntual.

## Modos de colapso — `collapsible`

| Modo                  | Comportamiento                                                | Cuándo usarlo                                                                                                                                               |
| --------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `offcanvas` (default) | Se desliza fuera de pantalla (ancho 0).                       | Cuando al colapsar quieres recuperar **todo** el ancho para el contenido.                                                                                   |
| `icon`                | Colapsa al **rail de iconos** (64px): solo iconos + tooltips. | Navegación persistente accesible con un clic. **Requiere `icon` en todos los ítems** y pasar `logoIcon` (el isotipo). Ítems sin icono desaparecen del rail. |
| `none`                | No colapsa.                                                   | Barras fijas o layouts donde el colapso no aporta.                                                                                                          |

En `icon`, el rail expande de vuelta al pasar el cursor (o con foco) sobre el
isotipo, que se transforma en el mismo botón que colapsa la barra expandida.

## Variantes — `variant`

- `sidebar` (default): pegada al borde, con divisoria. El caso normal.
- `floating`: tarjeta flotante con radio y sombra, separada del borde.
- `inset`: la barra y el contenido quedan "incrustados" con margen; el contenido
  se vuelve una superficie elevada. Para layouts con más aire.

## Modelo de datos

```tsx
const groups: AppSidebarGroup[] = [
  {
    // grupo plano (sin título): ítems de primer nivel con icono
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard, isActive: true },
      { title: "Proyectos", url: "/proyectos", icon: FolderKanban, badge: 4 },
      {
        title: "Equipo",
        icon: Users,
        items: [
          // branch → se expande (chevron)
          { title: "Miembros", url: "/equipo/miembros" },
          { title: "Roles", url: "/equipo/roles" },
        ],
      },
    ],
  },
  {
    label: "Análisis",
    collapsible: true, // grupo colapsable → ítems indentados (un nivel)
    defaultOpen: true,
    items: [
      { title: "Reportes", url: "/reportes", icon: BarChart3 },
      { title: "Ventas", url: "/ventas", isActive: true },
      { title: "Tráfico", url: "/trafico", badge: 12 },
    ],
  },
];
```

## Receta compuesta

`AppSidebar` es un wrapper ergonómico sobre las primitivas compuestas de `Sidebar`: describe la navegación como datos (`groups`) y compone la estructura canónica; las props extra pasan al `Sidebar` raíz y el `ref` apunta a ese nodo. Para layouts a medida (secciones custom, búsqueda embebida), usa las primitivas directamente:

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/base/Sidebar";
```

## Reglas

- La superficie permanece blanca; hover y selección recuperan la marca Lexy con lavanda e índigo mediante `sidebar-hover`, `sidebar-accent` y `sidebar-accent-foreground`.
- El ítem activo colorea texto e icono. No añadas color manualmente a cada entrada.
- Asigna `icon` a **todos** los ítems de primer nivel: en `collapsible="icon"`
  son lo único visible (la etiqueta aparece como tooltip).
- No anides más de un nivel de subítems.
- En un grupo colapsable los ítems van planos (un nivel); el anidamiento
  `item.items` aplica a grupos planos.
- `bordered` controla el borde con independencia del modo de colapso.
- Para casos a medida que no encajen en `groups`, usa las primitivas de
  `Sidebar` directamente; no mezcles ambos enfoques en la misma barra.

## Import

```tsx
import { AppSidebar } from "@/components/base/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/base/Sidebar";
```

## Props

### `AppSidebar`

| Prop          | Tipo                                 | Default       | Descripción                                         |
| ------------- | ------------------------------------ | ------------- | --------------------------------------------------- |
| `groups`      | `AppSidebarGroup[]`                  | —             | **Requerido.** Estructura de navegación.            |
| `logo`        | `ReactNode`                          | —             | Marca en la cabecera (expandida).                   |
| `logoIcon`    | `ReactNode`                          | —             | Marca compacta para el modo iconos (isotipo).       |
| `user`        | `{ name, email?, avatar? }`          | —             | Pie de usuario. Omitir para ocultarlo.              |
| `footer`      | `ReactNode`                          | —             | Pie a medida; sobrescribe `user`.                   |
| `collapsible` | `"offcanvas" \| "icon" \| "none"`    | `"offcanvas"` | Comportamiento al colapsar.                         |
| `side`        | `"left" \| "right"`                  | `"left"`      | Lado de la pantalla.                                |
| `variant`     | `"sidebar" \| "floating" \| "inset"` | `"sidebar"`   | Estilo del contenedor.                              |
| `bordered`    | `boolean`                            | `true`        | Borde lateral divisorio. Independiente del colapso. |

### `AppSidebarGroup`

| Campo         | Tipo               | Descripción                                                  |
| ------------- | ------------------ | ------------------------------------------------------------ |
| `label`       | `string?`          | Encabezado del grupo. Si se omite, los ítems van sin título. |
| `collapsible` | `boolean?`         | Encabezado con chevron que despliega/colapsa.                |
| `defaultOpen` | `boolean?`         | Estado inicial si es colapsable (default `true`).            |
| `items`       | `AppSidebarItem[]` | Ítems del grupo.                                             |

### `AppSidebarItem`

| Campo         | Tipo                | Descripción                                       |
| ------------- | ------------------- | ------------------------------------------------- |
| `title`       | `string`            | Texto visible.                                    |
| `url`         | `string?`           | Si se define, se renderiza como `<a href>`.       |
| `icon`        | `LucideIcon?`       | Icono a la izquierda.                             |
| `isActive`    | `boolean?`          | Marca la página actual.                           |
| `disabled`    | `boolean?`          | No navegable, atenuado.                           |
| `badge`       | `string \| number?` | Contador/etiqueta a la derecha.                   |
| `items`       | `AppSidebarItem[]?` | Subítems (solo en grupo plano → ítem expandible). |
| `defaultOpen` | `boolean?`          | Estado inicial si tiene subítems.                 |
