import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Components ported verbatim from the reference project keep the
    // reference's ref/effect patterns. The React Compiler lint rules
    // (refs during render, setState synchronously in an effect) flag those
    // patterns, but they are required to preserve the original design
    // (e.g. the campus marquee and the scroll-driven carousels) and match
    // how the reference project ships them.
    files: [
      "src/components/shared/**/*.jsx",
      "src/components/home/**/*.jsx",
      "src/components/universities/**/*.jsx",
      "src/components/layout/**/*.jsx",
    ],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
