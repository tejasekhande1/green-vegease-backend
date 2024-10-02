import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schema";

const POSTGRES_URL = process.env.POSTGRES_URL as string;
if (!POSTGRES_URL) {
    throw new Error("POSTGRES_URL is required.");
}

console.log(POSTGRES_URL);

const queryClient = postgres(POSTGRES_URL);
const db = drizzle(queryClient, { schema });

export default db;
