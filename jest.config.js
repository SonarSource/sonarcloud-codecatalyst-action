module.exports = {
    verbose: true,
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    testMatch: ['<rootDir>/test/**/?(*.)+(test).js'],
    testEnvironment: 'node',
    coverageThreshold: {
        // todo: back to 90%
        global: {
            branches: 30,
            statements: 30,
            functions: 30,
            lines: 30
        }
    },
    collectCoverage: true,
    coverageReporters: ['lcovonly'],
    coveragePathIgnorePatterns: ['<rootDir>/lib/.*\\.generated\\.[jt]s', '<rootDir>/test/.*\\.[jt]s', '<rootDir>/.warnings.jsii.js'],
    coverageDirectory: '<rootDir>/coverage'
};
