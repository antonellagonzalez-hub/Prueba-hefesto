# ScrollArea

Área de scroll estilizada con barras de scroll personalizadas.
Basado en `@radix-ui/react-scroll-area`.

## Cuándo usarlo

Para paneles con alto fijo cuyo contenido crece: listas laterales, paneles de detalle, menús largos. Estiliza la barra y evita saltos de layout. Para el scroll de la página entera no hace falta — el navegador ya sabe.

## Composición

`ScrollArea` envuelve el contenido y monta las barras necesarias según
`orientation`: vertical, horizontal o ambas.

## Uso básico

```tsx
<ScrollArea className="h-72 w-72 rounded-md border border-border p-4">
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.id}>
        <div className="font-medium">{item.title}</div>
        <div className="text-muted-foreground">{item.description}</div>
      </div>
    ))}
  </div>
</ScrollArea>
```

## Scroll horizontal

```tsx
<ScrollArea orientation="horizontal" className="w-96 rounded-md border border-border p-4">
  <div className="flex w-max gap-4">
    {items.map((item) => (
      <div key={item.id} className="w-32 shrink-0">
        {item.title}
      </div>
    ))}
  </div>
</ScrollArea>
```

## Scroll en ambos ejes

```tsx
<ScrollArea orientation="both" className="h-72 w-72 rounded-md border border-border p-4">
  <div className="h-[500px] w-[500px]">{content}</div>
</ScrollArea>
```

## Reglas

- Define una altura o ancho fijo para que el scroll funcione.
- El contenido debe ser más grande que el contenedor para que aparezca scroll.
- No envuelvas toda la página en `ScrollArea` → usa scroll nativo del body.
- No anides múltiples `ScrollArea`.

## Import

```tsx
import { ScrollArea } from "@/shared/components/base/ScrollArea"; // o @/components/base/ScrollArea
```

## Props

| Componente   | Props                                           | Descripción                                                                              |
| ------------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `ScrollArea` | `className?`, `children`, `orientation?`, `...` | Contenedor con scroll. `orientation`: `"vertical"` (default), `"horizontal"` o `"both"`. |
| `ScrollBar`  | `className?`, `orientation?`                    | Primitiva de barra para composiciones avanzadas.                                         |

## Para IA

1. Identifica si el contenido excede el espacio disponible.
2. Si necesitas scroll estilizado → usa `ScrollArea`.
3. Define `height` y/o `width` en el contenedor y elige `orientation`.
4. No uses `ScrollArea` para scroll de página completa.
