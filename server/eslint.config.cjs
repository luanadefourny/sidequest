// eslint.config.cjs
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = [
  { ignores: ['node_modules', 'dist', 'build', 'coverage', 'public'] },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];