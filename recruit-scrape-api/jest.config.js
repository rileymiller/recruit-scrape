module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    "<rootDir>/.aws-sam",
    "<rootDir>/__tests__/unit/fixtures",
    "<rootDir>/__tests__/unit/test-utils",
    "<rootDir>/__mocks__/",
  ],
  clearMocks: true,
  resetMocks: true,
  setupFiles: ['<rootDir>/jest/set-env-vars.js']
};
