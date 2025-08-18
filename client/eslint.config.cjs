/* eslint-disable no-undef */
/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const a11y = require('eslint-plugin-jsx-a11y');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const prettierOff = require('eslint-config-prettier');

module.exports = [
  { ignores: ['node_modules', '.vite', 'dist', 'build', 'coverage', 'eslint.config.cjs'] },
  
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Project rules
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': a11y,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Import order
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
    settings: { react: { version: 'detect' } },
  },

  // Turn off stylistic rules that conflict with Prettier
  prettierOff,
];