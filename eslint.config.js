const globals = require('globals');
const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactRedux = require('eslint-plugin-react-redux');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/validate-json/*.js'],
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.webextensions,
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'react-redux': reactRedux,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRedux.configs.recommended.rules,
      ...prettier.rules,
      'no-redeclare': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', args: 'none' },
      ],
    },
  },
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...prettier.rules,
      'no-redeclare': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', args: 'none' },
      ],
    },
  },
];
