export default {
    testEnvironment: "node",
    transform: {
        "^.+\\.js$": ["babel-jest", { configFile: "./.babelrc" }]
    },
    moduleFileExtensions: ["js"],
    testMatch: ["**/tests/**/*.test.js"],
    setupFilesAfterEnv: ["./tests/setup.js"],
    transformIgnorePatterns: [
        "node_modules/(?!(@prisma|@babel)/)"
    ]
}