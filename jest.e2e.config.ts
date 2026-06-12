import type { Config } from 'jest';

/** End-to-end HTTP tests via supertest against a real bootstrapped Nest app. */
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test/e2e'],
  testRegex: '.*\\.e2e-spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: { '^~/(.*)$': '<rootDir>/src/$1' },
  testTimeout: 60_000,
};
export default config;
