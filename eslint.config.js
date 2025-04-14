import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['src/**/*.ts'],
    ignores: ['node_modules/', 'dist/'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': ts,
      unicorn,
      prettier,
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
    rules: {
      ...ts.configs.recommended.rules,
      ...ts.configs.strict.rules,
      ...ts.configs.stylistic.rules,
      ...unicorn.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      '@typescript-eslint/member-ordering': 'error',
      'class-methods-use-this': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',

      '@typescript-eslint/no-extraneous-class': [
      'error',
      {
        'allowConstructorOnly': true,
        'allowEmpty': false,
        'allowStaticOnly': false
      }
    ],
    'max-lines-per-function': [
        'error',
        {
          max: 40,
          skipComments: true,
          skipBlankLines: true,
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[property.name='innerHTML']",
          message: "Use textContent or safe DOM manipulation methods instead of innerHTML"
        }
      ]
    },
  },
];