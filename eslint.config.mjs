import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Flat config. Next 16 removed `next lint`, so ESLint runs directly and the
 * old .eslintrc.json no longer applies.
 *
 * handoff/ holds design-reference .jsx that Next never builds — linting it just
 * reports on files that cannot reach production.
 */
const config = [
  {
    // Replaces the retired .eslintignore, which ESLint 9 no longer reads.
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      '.vercel/**',
      'handoff/**',
      'reference/**',
      'next-env.d.ts',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
