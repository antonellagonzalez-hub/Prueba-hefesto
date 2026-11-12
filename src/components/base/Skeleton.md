# Skeleton

Esqueleto de carga. Para estados de espera.

## Cuándo usarlo

Para esperas donde conoces la forma del contenido que viene: filas de tabla, cards, un detalle. Mantiene el layout estable y hace la espera sentirse más corta. Para acciones puntuales (guardar, enviar), el `Spinner` en el botón comunica mejor.

## Composición

Una sola pieza (`Skeleton`) que dibujas con las dimensiones del contenido real: unos cuantos rectángulos bastan para sugerir la estructura.

## Uso básico

```tsx
<Skeleton />
```

## Reglas

- Usa Skeleton según el propósito descrito.
- No abuses de este componente en contexts donde no aplica.

## Import

```tsx
import { Skeleton } from "@/components/base/Skeleton";
```

## Props

Consulta la story en Storybook para ver las props disponibles.

## Para IA

1. Identifica el contexto de uso del componente.
2. Importa Skeleton desde el path correcto.
3. Configura las props según la necesidad.
4. Verifica que el componente se integre correctamente en el layout.
5. Solo usa variantes documentadas.
