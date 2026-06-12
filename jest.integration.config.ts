import type { Config } from 'jest';

/** Integration tests — Testcontainers spins up a real Postgres. */
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test/integration'],
  testRegex: '.*\\.int-spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: { '^~/(.*)$': '<rootDir>/src/$1' },
  testTimeout: 60_000,
};
export default config;
