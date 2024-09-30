import { uuid, pgTable, varchar, text } from "drizzle-orm/pg-core";
import db from "../config/database";

export const categoryTable = pgTable("category", {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryName: varchar("category_name"),
    image: text("image"),
});

export type InsertCategory = typeof categoryTable.$inferInsert;
export type SelectCategory = typeof categoryTable.$inferSelect;

export async function insertCategory(
    category: InsertCategory,
): Promise<SelectCategory[]> {
    return db.insert(categoryTable).values(category).returning();
}
