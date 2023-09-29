/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleNameMapper: {
    '^@icon/(.+)': '<rootDir>/src/icon/$1',
    '^@lib/(.+)': '<rootDir>/src/lib/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.ts'],
};
