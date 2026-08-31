import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // three.js objects (materials, uniforms, Object3D transforms) are mutated
    // imperatively by design — that is the whole point of the render loop, and
    // React never re-renders on those writes. The React Compiler immutability
    // rule flags every one of them, so it is off inside the WebGL scene only.
    files: ["src/components/ParticleHero/**"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
