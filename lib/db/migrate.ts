import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

// This script runs migrations on your database
async function main() {
  console.log("Running migrations...")

  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  // For migrations, we need a different connection than the one used in the app
  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 })
  const db = drizzle(migrationClient)

  // This will run all migrations in the "migrations" folder
  await migrate(db, { migrationsFolder: "drizzle" })

  console.log("Migrations completed successfully")
  process.exit(0)
}

main().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})

