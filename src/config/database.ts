import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const POSTGRES_URL = process.env.POSTGRES_URL as string;
if (!POSTGRES_URL) {
    throw new Error("POSTGRES_URL is required.");
}

const queryClient = postgres(POSTGRES_URL);
const db:  PostgresJsDatabase = drizzle(queryClient);

export default db;