import { text, uuid, pgTable, varchar, timestamp, integer, foreignKey } from "drizzle-orm/pg-core";
import db from "../config/database";
import { categoryTable } from "./Category"

export const productTable = pgTable("product", {
    id: uuid("id").primaryKey().defaultRandom(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    images: text("images"),
    categoryId: uuid("id").references(() => categoryTable.id),
    totalOrders: integer("total_orders").default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export type InsertProduct = typeof productTable.$inferInsert;
export type SelectProduct = typeof productTable.$inferSelect;

export async function insertProduct(product: InsertProduct): Promise<SelectProduct[]> {
    return db.insert(productTable).values(product).returning();
}
