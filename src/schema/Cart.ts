import { pgTable, timestamp, uuid, uniqueIndex, integer } from "drizzle-orm/pg-core";
import { userTable } from "./Auth";
import { productTable } from "./Product";

export const cartTable = pgTable("cart", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => userTable.id).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
}, (table) => {
    return {
        userIdx: uniqueIndex("user_id_idx").on(table.userId)
    }
});

export const cartItemTable = pgTable("cart_item", {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id").references(() => cartTable.id).notNull(),
    productId: uuid("product_id").references(() => productTable.id).notNull(),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
}, (table) => {
    return {
        cartIdIdx: uniqueIndex("cart_id_idx").on(table.cartId)
    }
});