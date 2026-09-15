import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import jsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // next/core-web-vitals already registers the jsx-a11y plugin; add its recommended rule set on top
  { rules: jsxA11y.flatConfigs.recommended.rules },
  { ignores: [".next/**", "node_modules/**", "out/**", "qa/**", "data/**", "next-env.d.ts"] },
];
export default eslintConfig;
