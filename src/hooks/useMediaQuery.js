"use client";

import { useEffect, useState } from "react";

/**
 * Ported from the reference project (src/hooks/useMediaQuery.ts).
 *
 * SSR-safe: the first render always returns `false` (matching the server),
 * and the real value is applied in the effect right after hydration.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();

    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;
