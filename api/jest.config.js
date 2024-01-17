module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/Test/**/*.test.ts'],
  coveragePathIgnorePatterns: [
    "ConnectionManager.ts"
  ]
};
