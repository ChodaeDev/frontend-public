import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
    ],
  },
  {
    plugins: {
      stylistic,
    },
    rules: {
      // 기본 규칙
      'object-curly-spacing': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'space-infix-ops': ['error', { int32Hint: false }],
      'no-multi-spaces': 'error',
      'comma-spacing': ['error', { before: false, after: true }],
      'quotes': ['error', 'single'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'semi': ['error', 'always'],

      // Stylistic 규칙
      'stylistic/semi': 'error',
      'stylistic/quotes': ['error', 'single'],
      'stylistic/indent': ['error', 2],
      'stylistic/no-trailing-spaces': 'error',
      'stylistic/comma-dangle': ['error', 'always-multiline'],
      'stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
      'stylistic/jsx-curly-spacing': ['error', {
        when: 'never',
        children: true,
      }],
      'stylistic/jsx-curly-brace-presence': ['error', {
        props: 'always',
        children: 'always',
      }],
      'stylistic/object-curly-spacing': ['error', 'always'],
      'stylistic/array-bracket-spacing': ['error', 'never'],
      'stylistic/jsx-closing-tag-location': 'error',
      'stylistic/jsx-closing-bracket-location': 'error',
      'stylistic/jsx-self-closing-comp': ['error', {
        component: true,
        html: true,
      }],
      'stylistic/jsx-tag-spacing': ['error', {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
      }],
      'stylistic/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      }],
      'stylistic/no-multi-spaces': 'error',
      'stylistic/template-curly-spacing': ['error', 'always'],
      'stylistic/jsx-equals-spacing': ['error', 'never'],
      'stylistic/no-mixed-operators': 'error',
      'stylistic/no-whitespace-before-property': 'error',
      'stylistic/operator-linebreak': ['error', 'before'],
      'stylistic/padded-blocks': ['error', 'never'],
      'stylistic/rest-spread-spacing': ['error', 'never'],
      'stylistic/space-before-blocks': ['error', 'always'],
      'stylistic/space-infix-ops': 'error',
      'stylistic/space-unary-ops': 'error',
      'stylistic/spaced-comment': ['error', 'always'],
      'stylistic/switch-colon-spacing': ['error', { after: true, before: false }],
      'stylistic/template-tag-spacing': 'error',
      'stylistic/type-annotation-spacing': ['error', { before: false, after: true }],
      'stylistic/type-generic-spacing': ['error'],
      'stylistic/type-named-tuple-spacing': ['error'],
      'stylistic/wrap-iife': ['error', 'outside'],
      'stylistic/array-element-newline': ['error', 'consistent'],
      'stylistic/arrow-parens': 'error',
      'stylistic/comma-style': ['error', 'last'],
      'stylistic/dot-location': ['error', 'property'],
      'stylistic/function-call-argument-newline': ['error', 'consistent'],
    },
  },
];

export default eslintConfig;
