import * as React from "react";

/**
 * ¿Coincide el viewport con esta media query? Para cuando el cambio no se
 * puede expresar con clases (montar un panel fijo vs. un Sheet).
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
