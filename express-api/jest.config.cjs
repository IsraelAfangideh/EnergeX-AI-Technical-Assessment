// jest.config.cjs
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: {
                module: 'commonjs',
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                strict: false,
                skipLibCheck: true
            }
        }]
    },
    testMatch: ['**/tests/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    clearMocks: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$))'
    ]
};