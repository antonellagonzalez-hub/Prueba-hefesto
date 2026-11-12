"use client";

import { ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "./Sidebar";

// AppSidebar — envoltorio *data-driven* sobre las primitivas de `Sidebar`.
//
// En lugar de componer 20+ subcomponentes a mano, describes la navegación como
// datos (`groups`) y el componente arma la composición correcta, replicando la
// estética canónica de `Sidebar` (paddings px-8, grupos colapsables con chevron,
// sub-ítems indentados con `SidebarMenuSub` a pl-9, pie de usuario con borde).
//
// Para casos a medida, las primitivas de `./Sidebar` siguen disponibles.
//
// Se usa dentro de un <SidebarProvider> (junto a <SidebarInset> para el
// contenido). Ver la story para el layout completo.

type IconType = React.ComponentType<{ className?: string }>;

export interface AppSidebarItem {
  /** Texto visible del ítem. */
  title: string;
  /** Si se define, el ítem se renderiza como enlace `<a href>`. */
  url?: string;
  /** Icono (p. ej. de lucide-react). Se renderiza a la izquierda. */
  icon?: IconType;
  /** Marca el ítem como activo (página actual). */
  isActive?: boolean;
  /** Deshabilita el ítem (no navegable). */
  disabled?: boolean;
  /** Contador/etiqueta a la derecha (p. ej. nº de notificaciones). */
  badge?: string | number;
  /** Subítems anidados → convierte el ítem en colapsable. */
  items?: AppSidebarItem[];
  /** Si el ítem tiene subítems, si arranca expandido. */
  defaultOpen?: boolean;
}

export interface AppSidebarGroup {
  /** Encabezado del grupo. Si se omite, los ítems van sin título. */
  label?: string;
  /** Si el grupo se puede colapsar con un chevron en su encabezado. */
  collapsible?: boolean;
  /** Si es colapsable, si arranca expandido (default: true). */
  defaultOpen?: boolean;
  items: AppSidebarItem[];
}

export interface AppSidebarUser {
  name: string;
  email?: string;
  avatar?: string;
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  /** Marca en la cabecera cuando está expandida (normalmente el `Logo`). */
  logo?: React.ReactNode;
  /** Marca compacta para el modo colapsado a iconos (p. ej. el isotipo). */
  logoIcon?: React.ReactNode;
  /** Estructura de navegación. */
  groups: AppSidebarGroup[];
  /** Usuario en el pie. Ignorado si se pasa `footer`. */
  user?: AppSidebarUser;
  /** Pie a medida; sobrescribe el render de `user`. */
  footer?: React.ReactNode;
  /**
   * Borde lateral divisorio. Independiente del modo de colapso.
   * Default: `true`.
   */
  bordered?: boolean;
}

// ─── Ítem de primer nivel (botón de menú con icono) ───────────────────────────

function LeafItem({ item }: { item: AppSidebarItem }) {
  const Icon = item.icon;
  const inner = (
    <>
      {Icon && <Icon className="size-(--icon-size-inline) shrink-0" />}
      <span className="truncate">{item.title}</span>
    </>
  );

  return (
    // El rail solo muestra iconos: un ítem sin icono desaparece al colapsar y
    // los que sí tienen se apilan arriba sin huecos.
    <SidebarMenuItem className={cn(!Icon && "group-data-[collapsible=icon]:hidden")}>
      <SidebarMenuButton
        asChild={!!item.url && !item.disabled}
        isActive={item.isActive}
        tooltip={item.title}
        aria-disabled={item.disabled || undefined}
        aria-current={item.isActive ? "page" : undefined}
        className={cn(
          "h-8 rounded-nav-item px-2 type-supporting",
          item.disabled && "pointer-events-none opacity-50",
        )}
      >
        {item.url && !item.disabled ? <a href={item.url}>{inner}</a> : inner}
      </SidebarMenuButton>
      {item.badge != null && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}

// ─── Sub-ítem indentado (compartido por grupos colapsables y branch items) ────

function SubButton({ item }: { item: AppSidebarItem }) {
  if (item.items && item.items.length > 0) {
    return <SubBranchItem item={item} />;
  }

  const Icon = item.icon;
  const inner = (
    <>
      {Icon && <Icon className="size-(--icon-size-inline) shrink-0" />}
      <span className="truncate">{item.title}</span>
      {item.badge != null && (
        <span className="ml-auto type-meta font-medium tabular-nums text-muted-foreground">
          {item.badge}
        </span>
      )}
    </>
  );

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild={!!item.url && !item.disabled}
        isActive={item.isActive}
        aria-disabled={item.disabled || undefined}
        aria-current={item.isActive ? "page" : undefined}
        className={cn(
          "h-8 rounded-nav-item py-1.5 pl-9 pr-2 type-supporting",
          item.disabled && "cursor-not-allowed text-muted-foreground",
        )}
      >
        {item.url && !item.disabled ? <a href={item.url}>{inner}</a> : inner}
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

// ─── Sub-ítem desplegable (permite jerarquías de navegación profundas) ────────

function SubBranchItem({ item }: { item: AppSidebarItem }) {
  const [open, setOpen] = React.useState(item.defaultOpen ?? false);
  const Icon = item.icon;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={item.isActive}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="h-8 rounded-nav-item py-1.5 pl-9 pr-2 type-supporting"
      >
        {Icon && <Icon className="size-(--icon-size-inline) shrink-0" />}
        <span className="truncate">{item.title}</span>
        <ChevronRight
          className={cn(
            "ml-auto size-(--icon-size-inline) shrink-0 text-muted-foreground transition-transform duration-[var(--duration-normal)] ease-[var(--ease-standard)] motion-reduce:transition-none",
            open && "rotate-90",
          )}
        />
      </SidebarMenuSubButton>

      {open && (
        <SidebarMenuSub className="ml-3 mr-0 mt-1 gap-1 border-l-0 px-0 py-0">
          {item.items!.map((sub) => (
            <SubButton key={sub.title} item={sub} />
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuSubItem>
  );
}

// ─── Ítem de primer nivel con subítems (colapsable, chevron a la derecha) ─────

function BranchItem({ item }: { item: AppSidebarItem }) {
  const [open, setOpen] = React.useState(item.defaultOpen ?? false);
  const Icon = item.icon;

  return (
    <SidebarMenuItem className={cn(!Icon && "group-data-[collapsible=icon]:hidden")}>
      <SidebarMenuButton
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        isActive={item.isActive}
        tooltip={item.title}
        className="h-8 rounded-nav-item px-2 type-supporting"
      >
        {Icon && <Icon className="size-(--icon-size-inline) shrink-0" />}
        <span className="truncate">{item.title}</span>
        <ChevronRight
          className={cn(
            "ml-auto size-(--icon-size-inline) shrink-0 text-muted-foreground transition-transform duration-[var(--duration-normal)] ease-[var(--ease-standard)] motion-reduce:transition-none",
            open && "rotate-90",
          )}
        />
      </SidebarMenuButton>

      {open && (
        <SidebarMenuSub className="mx-0 mt-1 gap-1 border-l-0 px-0 py-0">
          {item.items!.map((sub) => (
            <SubButton key={sub.title} item={sub} />
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

// ─── Grupo ────────────────────────────────────────────────────────────────────

function Group({ group }: { group: AppSidebarGroup }) {
  const [open, setOpen] = React.useState(group.defaultOpen ?? true);

  // Grupo colapsable: encabezado bold con chevron a la izquierda + sub-ítems
  // indentados (mismo patrón que las stories de Sidebar).
  if (group.collapsible && group.label) {
    return (
      <SidebarGroup className="mb-1 p-0">
        <SidebarGroupLabel
          asChild
          className="h-8 rounded-nav-item px-2 type-supporting font-semibold text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground"
        >
          <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <ChevronRight
              className={cn(
                "mr-3 size-(--icon-size-inline) shrink-0 text-muted-foreground transition-transform duration-[var(--duration-normal)] ease-[var(--ease-standard)] motion-reduce:transition-none",
                open && "rotate-90",
              )}
            />
            <span className="truncate">{group.label}</span>
          </button>
        </SidebarGroupLabel>

        {open && (
          <SidebarGroupContent>
            <SidebarMenuSub className="mx-0 mt-1 gap-1 border-l-0 px-0 py-0">
              {group.items.map((item) => (
                <SubButton key={item.title} item={item} />
              ))}
            </SidebarMenuSub>
          </SidebarGroupContent>
        )}
      </SidebarGroup>
    );
  }

  // Grupo plano: etiqueta estática opcional + ítems de primer nivel.
  return (
    <SidebarGroup className="mb-1 p-0">
      {group.label && (
        <SidebarGroupLabel className="px-2 type-meta font-medium text-muted-foreground">
          {group.label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) =>
            item.items && item.items.length > 0 ? (
              <BranchItem key={item.title} item={item} />
            ) : (
              <LeafItem key={item.title} item={item} />
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ─── Pie de usuario ───────────────────────────────────────────────────────────

function UserFooter({ user }: { user: AppSidebarUser }) {
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={user.name}
          className="h-auto gap-3 rounded-nav-item px-2 py-1.5 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-0"
        >
          <Avatar className="size-8 shrink-0">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate type-supporting font-medium">{user.name}</span>
            {user.email && (
              <span className="truncate type-meta text-muted-foreground">{user.email}</span>
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────

export const AppSidebar = React.forwardRef<HTMLDivElement, AppSidebarProps>(function AppSidebar(
  { logo, logoIcon, groups, user, footer, bordered = true, className, ...sidebarProps },
  ref,
) {
  const collapsible = sidebarProps.collapsible ?? "offcanvas";
  const canToggle = collapsible !== "none";

  // Borde desacoplado del modo de colapso: lo decide `bordered`, no `collapsible`.
  // El Sidebar trae el borde por defecto (variant sidebar) vía una clase con
  // modificador de `side`, así que para quitarlo hace falta `!important`.
  const borderClass = bordered ? "" : "!border-l-0 !border-r-0";

  return (
    <Sidebar ref={ref} className={cn(borderClass, className)} {...sidebarProps}>
      {(logo != null || logoIcon != null) && (
        <SidebarHeader className="px-0 py-6">
          {/* Las dos marcas se superponen y hacen cross-fade. El isotipo se ancla
              a los primeros 64px (la franja de iconos) para aparecer ya en su
              posición final, sin desplazarse con la animación de ancho. */}
          <div className="relative h-8">
            {/* Expandida: logo + trigger (sale con fade) */}
            <div className="absolute inset-0 flex items-center gap-3 pl-8 pr-2 transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-standard)] motion-reduce:transition-none group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0">
              <div className="flex min-w-0 flex-1 items-center">{logo}</div>
              {canToggle && (
                <SidebarTrigger
                  aria-label="Colapsar barra lateral"
                  className="size-8 shrink-0 bg-transparent shadow-none"
                />
              )}
            </div>
            {/* Colapsada a iconos: el isotipo conserva su altura dentro del logo
                (h-6, mismo viewBox alto) y se centra en el eje del rail (64px).
                Al pasar el cursor (o con foco) el isotipo se desvanece y aparece
                el MISMO SidebarTrigger que colapsa la sidebar expandida: idéntico
                estilo ghost, icono e hover. */}
            {logoIcon != null && (
              <div className="group/rail-logo pointer-events-none absolute inset-y-0 left-0 w-(--sidebar-width-icon) opacity-0 transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-standard)] motion-reduce:transition-none group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:opacity-100">
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-[var(--duration-fast)] group-hover/rail-logo:opacity-0 group-focus-within/rail-logo:opacity-0">
                  {logoIcon}
                </span>
                {canToggle && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover/rail-logo:opacity-100 group-focus-within/rail-logo:opacity-100">
                    <SidebarTrigger
                      aria-label="Expandir barra lateral"
                      className="size-8 shrink-0 bg-transparent shadow-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </SidebarHeader>
      )}

      <SidebarContent className="px-8 pb-6 group-data-[collapsible=icon]:px-4">
        {groups.map((group, i) => (
          <Group key={group.label ?? `group-${i}`} group={group} />
        ))}
      </SidebarContent>

      {(footer != null || user != null) && (
        <SidebarFooter className="border-t border-sidebar-border px-8 py-3 group-data-[collapsible=icon]:px-4">
          {footer != null ? footer : user != null ? <UserFooter user={user} /> : null}
        </SidebarFooter>
      )}
    </Sidebar>
  );
});

AppSidebar.displayName = "AppSidebar";
