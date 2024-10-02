import {
    text,
    uuid,
    pgTable,
    varchar,
    timestamp,
    integer,
} from "drizzle-orm/pg-core";
import { categoryTable } from "./Category";

export const productTable = pgTable("product", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("product_name", { length: 255 }).notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    images: text("images"),
    quantityInKg: integer("quantity_in_kg").notNull().default(0),
    categoryId: uuid("category_id").references(() => categoryTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertProduct = typeof productTable.$inferInsert;
export type SelectProduct = typeof productTable.$inferSelect;

