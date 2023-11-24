module.exports = {
    moduleFileExtensions: ['js', 'ts'],
    testMatch: ['<rootDir>/test/**/?(*.)+(test).js'],
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: ['lcovonly'],
    coveragePathIgnorePatterns: ['<rootDir>/lib/.*\\.generated\\.[jt]s', '<rootDir>/test/.*\\.[jt]s', '<rootDir>/.warnings.jsii.js'],
    coverageDirectory: '<rootDir>/coverage'
};
