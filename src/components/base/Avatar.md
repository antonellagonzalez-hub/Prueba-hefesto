# Avatar

Imagen de perfil con fallback. Para identificación visual.

## Cuándo usarlo

Para identificar visualmente a una persona u organización: en headers, filas, comentarios, asignaciones. Con fallback de iniciales siempre — la foto es un privilegio, no una garantía.

## Composición

`Avatar` con `AvatarImage` (la foto) y `AvatarFallback` (iniciales sobre fondo de marca), que aparece si la imagen falla o no existe.

## Uso básico

```tsx
<Avatar />
```

## Reglas

- Usa Avatar según el propósito descrito.
- No abuses de este componente en contexts donde no aplica.

## Import

```tsx
import { Avatar } from "@/components/base/Avatar";
```

## Props

Consulta la story en Storybook para ver las props disponibles.

## Para IA

1. Identifica el contexto de uso del componente.
2. Importa Avatar desde el path correcto.
3. Configura las props según la necesidad.
4. Verifica que el componente se integre correctamente en el layout.
5. Solo usa variantes documentadas.
