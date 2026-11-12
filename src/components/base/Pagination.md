# Pagination

Navegación de paginación para listados, tablas y resultados de búsqueda.
Compuesta por sub-componentes que permiten construir distintas configuraciones.

## Cuándo usarlo

Para dividir listados largos en páginas con posición visible: tablas de desk, resultados de búsqueda. Si el contexto es exploración continua (un feed), considera “cargar más” en su lugar.

## Composición

`Pagination` > `PaginationContent` > `PaginationItem`s con `PaginationPrevious`, `PaginationLink` (los números), `PaginationEllipsis` y `PaginationNext`.

## Uso básico

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="/items?page=1" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/items?page=1" isActive>
        1
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/items?page=2">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/items?page=3">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/items?page=10">10</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="/items?page=2" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Con muchas páginas

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">4</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>
        5
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">6</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">20</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Reglas

- Muestra máximo 5–7 números de página visibles.
- Usa `PaginationEllipsis` para ocultar páginas intermedias.
- Marca la página actual con `isActive`.
- Deshabilita u oculta "Anterior" en la primera página.
- Deshabilita u oculta "Siguiente" en la última página.
- No uses paginación para menos de 2 páginas.
- No mezcles paginación con scroll infinito en la misma vista.

## Import

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/shared/components/base/Pagination"; // o @/components/base/Pagination
```

## Props

### Sub-componentes

| Componente           | Props                                       | Descripción                                       |
| -------------------- | ------------------------------------------- | ------------------------------------------------- |
| `Pagination`         | `className?`                                | Contenedor `nav` con `aria-label="pagination"`.   |
| `PaginationContent`  | `className?`                                | Lista `ul` que contiene los items.                |
| `PaginationItem`     | —                                           | Item `li` de la lista.                            |
| `PaginationLink`     | `isActive?: boolean`, `size?`, `className?` | Link de página. `isActive` aplica estilo outline. |
| `PaginationPrevious` | `text?: string`, `className?`               | Botón "Anterior" con icono.                       |
| `PaginationNext`     | `text?: string`, `className?`               | Botón "Siguiente" con icono.                      |
| `PaginationEllipsis` | `className?`                                | Indicador de páginas omitidas ("...").            |

## Para IA

1. Identifica si el listado tiene más de una página de resultados.
2. Si es paginable → usa `Pagination`.
3. Calcula el rango de páginas visibles (máximo 5–7 items).
4. Usa `PaginationEllipsis` para ocultar páginas intermedias.
5. Marca la página actual con `isActive` en `PaginationLink`.
6. Deshabilita/oculta los botones de navegación en los extremos.
7. Considera scroll infinito si la navegación por página no aporta valor.
