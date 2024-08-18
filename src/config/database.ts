import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;

if (
    !POSTGRES_HOST ||
    !POSTGRES_DB ||
    !POSTGRES_USER ||
    !POSTGRES_PASSWORD ||
    !POSTGRES_PORT
) {
    throw new Error("Missing postgres environment variables");
}

const queryClient = postgres(`postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`);
const db:  PostgresJsDatabase = drizzle(queryClient);

export default db;