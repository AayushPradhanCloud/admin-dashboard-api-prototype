import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

/**
 * Rolls back the most recently created migration by applying its hand-written
 * `down.sql` via `prisma db execute`. See CONTRIBUTING.md → "Migrations & rollbacks".
 */
function findLatestMigrationDir(): string {
  const migrationsRoot = path.resolve(process.cwd(), 'prisma', 'migrations');
  const migrations = readdirSync(migrationsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const latest = migrations[migrations.length - 1];
  if (!latest) throw new Error(`No migrations found in ${migrationsRoot}`);
  return path.join(migrationsRoot, latest);
}

function main(): void {
  const migrationDir = findLatestMigrationDir();
  const downFile = path.join(migrationDir, 'down.sql');
  if (!existsSync(downFile)) {
    throw new Error(
      `No down.sql found for migration "${path.basename(migrationDir)}". Every migration must ship a down.sql — see CONTRIBUTING.md.`,
    );
  }

  // eslint-disable-next-line no-console
  console.log(`⏪ Rolling back migration "${path.basename(migrationDir)}" using ${downFile}`);
  execSync(`pnpm prisma db execute --file "${downFile}" --schema=./prisma/schema`, { stdio: 'inherit' });
}

try {
  main();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
}
