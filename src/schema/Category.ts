import { text, uuid, pgTable, varchar, timestamp, foreignKey } from "drizzle-orm/pg-core";
import db from '../config/database';

export const categoryTable = pgTable("category",{
    id:uuid('id').primaryKey().defaultRandom(),
    categoryName:varchar('category_name'),
});

export type InsertCategory = typeof categoryTable.$inferInsert;
export type SelectCategory = typeof categoryTable.$inferSelect;

export async function insertCategory(category: InsertCategory): Promise<SelectCategory[]> {
    return db.insert(categoryTable).values(category).returning();
}