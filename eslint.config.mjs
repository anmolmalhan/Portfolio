import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Em-dashes are banned from reader-facing copy — see the two commits that
 * purged them (`c0813e2`, `61c3e84`). The rule kept drifting back in because
 * nothing enforced it, so this makes it a lint error.
 *
 * Targets JSXText and string literals only. Code comments are not AST nodes
 * these selectors match, so prose in comments is deliberately still allowed;
 * the convention is about what a visitor reads, not what a developer does.
 */
const noEmDashInCopy = {
  files: ["src/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "JSXText[value=/\\u2014/]",
        message:
          "No em-dashes in reader-facing copy. Use a comma, colon, or full stop.",
      },
      {
        selector: "Literal[value=/\\u2014/]",
        message:
          "No em-dashes in reader-facing copy. Use a comma, colon, or full stop.",
      },
      {
        selector: "TemplateElement[value.raw=/\\u2014/]",
        message:
          "No em-dashes in reader-facing copy. Use a comma, colon, or full stop.",
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  noEmDashInCopy,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Test artefacts.
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
