// jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    "**/*.js",
    "!**/server.js",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/jest.config.js**"
  ],
  testPathIgnorePatterns: [
    "app.js"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
