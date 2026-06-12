/* eslint-env node */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'boundaries', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.cjs', 'dist/**', 'node_modules/**', 'coverage/**', 'prisma/migrations/**'],
  settings: {
    'import/resolver': {
      typescript: { project: './tsconfig.eslint.json' },
      node: true,
    },
    'boundaries/elements': [
      { type: 'domain', pattern: 'src/core/domain/**' },
      { type: 'application', pattern: 'src/core/application/**' },
      { type: 'adapters', pattern: 'src/adapters/**' },
      { type: 'infrastructure', pattern: 'src/infrastructure/**' },
      { type: 'common', pattern: 'src/common/**' },
    ],
  },
  rules: {
    // ---------- Architectural boundaries (hexagonal/onion) ----------
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          // domain may import from itself only
          { from: 'domain', allow: ['domain'] },
          // application may import domain + itself
          { from: 'application', allow: ['domain', 'application'] },
          // adapters may import application ports + domain (anti-corruption) + common
          { from: 'adapters', allow: ['application', 'domain', 'adapters', 'common'] },
          // infrastructure wires everything
          { from: 'infrastructure', allow: ['domain', 'application', 'adapters', 'infrastructure', 'common'] },
          // common is framework-agnostic helpers; may not import core
          { from: 'common', allow: ['common'] },
        ],
      },
    ],

    // ---------- Import hygiene ----------
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          { pattern: '@nestjs/**', group: 'external', position: 'before' },
          { pattern: '~/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-default-export': 'error',
    'import/no-cycle': ['error', { maxDepth: 5 }],

    // ---------- TypeScript strictness ----------
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // ---------- Code quality ----------
    complexity: ['error', { max: 10 }],
    'max-depth': ['error', 4],
    'max-lines-per-function': ['warn', { max: 80, skipComments: true, skipBlankLines: true }],
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // ---------- Airbnb adjustments for NestJS/TS/DDD conventions ----------
    // Named exports only — directly conflicts with import/no-default-export above.
    'import/prefer-default-export': 'off',
    // NestJS lifecycle/interface methods (NestMiddleware.use, NestInterceptor.intercept,
    // ExceptionFilter.catch, NestModule.configure) must be instance methods even when
    // they don't reference `this`; private mapper methods follow the same shape.
    'class-methods-use-this': 'off',
    // CQRS co-locates a command/query with its handler, and related DTOs/exceptions
    // are grouped in one file by design — see CONTRIBUTING.md.
    'max-classes-per-file': 'off',
    // `_name` / `_domainEvents` is the established convention for private backing
    // fields with public getters throughout the domain layer.
    'no-underscore-dangle': 'off',
    // Sequential awaits in a loop are intentional for the transactional outbox /
    // ordered event publishing and deterministic test fixtures.
    'no-await-in-loop': 'off',
    // Native for-of is fully supported on our target runtimes; Airbnb's
    // regenerator-runtime concern doesn't apply to compiled TS.
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain. Use Object.keys/values/entries instead.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    // `void promise` is the standard way to mark a deliberately unawaited promise
    // (see @typescript-eslint/no-floating-promises), e.g. the bootstrap() call.
    'no-void': ['error', { allowAsStatement: true }],
    // Allow compact one-line class members (e.g. DTO properties) without
    // requiring a blank line between each one.
    '@typescript-eslint/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
  },
  overrides: [
    {
      // No barrel files inside domain/application — enforced by file pattern
      files: ['src/core/domain/**/index.ts', 'src/core/application/**/index.ts'],
      rules: {
        'no-restricted-syntax': [
          'error',
          { selector: 'ExportAllDeclaration', message: 'Barrel re-exports are forbidden in domain/application layers.' },
        ],
      },
    },
    {
      files: ['**/*.spec.ts', 'test/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'max-lines-per-function': 'off',
      },
    },
    {
      // Tooling config files (Jest, etc.) are required by their consumers to use a default export.
      files: ['*.config.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      // Section 7.1: JSDoc required on the public API surface — controllers/DTOs,
      // outbound ports, and CQRS commands/queries/handlers.
      files: [
        'src/adapters/driving/http/**/*.ts',
        'src/core/application/**/ports/*.ts',
        'src/core/application/**/*.command.ts',
        'src/core/application/**/*.query.ts',
        'src/core/application/**/*.handler.ts',
      ],
      rules: {
        'jsdoc/require-jsdoc': [
          'error',
          {
            publicOnly: true,
            checkConstructors: false,
            require: {
              ClassDeclaration: true,
              MethodDefinition: true,
            },
            contexts: ['TSInterfaceDeclaration', 'TSMethodSignature'],
          },
        ],
        'jsdoc/require-param': 'error',
        'jsdoc/require-returns': 'error',
        'jsdoc/check-param-names': 'error',
        'jsdoc/check-tag-names': 'error',
      },
    },
  ],
};
