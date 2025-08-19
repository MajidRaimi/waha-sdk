module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    env: {
        node: true,
        es2020: true,
    },
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json',
            },
        },
    },
    rules: {
        // TypeScript-specific rules
        '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/prefer-nullish-coalescing': 'warn',
        '@typescript-eslint/prefer-optional-chain': 'warn',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-misused-promises': 'error',

        // General ESLint rules
        'no-console': 'warn',
        'no-debugger': 'error',
        'prefer-const': 'off', // Using TypeScript version
        'no-var': 'error',
        'object-shorthand': 'warn',
        'prefer-template': 'warn',
        'prefer-arrow-callback': 'warn',
        'no-param-reassign': 'warn',
        'no-return-assign': 'error',
        'no-useless-return': 'warn',
        'consistent-return': 'warn',
        'no-unreachable': 'error',
        'no-duplicate-imports': 'error',
        'no-unused-expressions': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',

        // Code quality rules
        'complexity': ['warn', 10],
        'max-depth': ['warn', 4],
        'max-lines-per-function': ['warn', 50],
        'max-params': ['warn', 4],

        // Security rules
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',

        // Import rules
        'import/order': [
            'warn',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
                'newlines-between': 'never',
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'import/no-duplicates': 'error',
        'import/no-unresolved': 'error',
        'import/no-unused-modules': 'warn',
    },
    overrides: [
        {
            files: ['*.test.ts', '*.spec.ts'],
            env: {
                jest: false, // We're using Bun test, not Jest
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                'no-console': 'off',
                'max-lines-per-function': 'off',
            },
        },
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
            },
        },
    ],
    ignorePatterns: [
        'dist/',
        'node_modules/',
        'coverage/',
        '*.d.ts',
        '.eslintrc.js',
        '__tests__/',
        '*.test.ts',
        '*.spec.ts',
    ],
};