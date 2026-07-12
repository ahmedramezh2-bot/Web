import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

/**
 * ESLint flat config.
 * Rule of the Bible: "Every file must answer: why does this exist?"
 * We enforce that mechanically where we can — no unused exports,
 * no implicit any, no dead code left behind.
 */
const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // next-env.d.ts is auto-generated and rewritten by Next.js itself
    // on every dev/build run — never hand-edited, never linted.
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'],
  },
];

export default config;
