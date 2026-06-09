module.exports = {
    // Tell Jest to use ts-jest for .ts/.tsx files
    preset: 'ts-jest',

    // Use Node as the test environment
    testEnvironment: 'node',

    // Make sure Jest knows to look for .ts files
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/node_modules/",
    ],
    coveragePathIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/node_modules/",
    ]
};