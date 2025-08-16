// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx,jsx}'],
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '**/*.min.js',
      '.vite/**',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        alert: 'readonly',
        performance: 'readonly',
        localStorage: 'readonly',
        AbortController: 'readonly',
        HTMLElement: 'readonly',
        MessageChannel: 'readonly',
        queueMicrotask: 'readonly',
        setImmediate: 'readonly',
        reportError: 'readonly',
        MSApp: 'readonly',
        MutationObserver: 'readonly',
        __REACT_DEVTOOLS_GLOBAL_HOOK__: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['vite.config.ts', '*.config.ts', '*.config.js', '*.config.mjs'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
      },
    },
  }
);
