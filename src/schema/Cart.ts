import {
    pgTable,
    timestamp,
    uuid,
    uniqueIndex,
    integer,
    primaryKey,
} from "drizzle-orm/pg-core";
import { userTable } from "./Auth";
import { productTable } from "./Product";

export const cartTable = pgTable(
    "cart",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id")
            .references(() => userTable.id, { onDelete: "cascade" })
            .notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => {
        return {
            userIdx: uniqueIndex("user_id_idx").on(table.userId),
        };
    },
);

export type InsertCart = typeof cartTable.$inferInsert;
export type SelectCart = typeof cartTable.$inferSelect;

export const cartItemTable = pgTable(
    "cart_item",
    {
        cartId: uuid("cart_id")
            .references(() => cartTable.id, { onDelete: "cascade" })
            .notNull(),
        productId: uuid("product_id")
            .references(() => productTable.id, { onDelete: "cascade" })
            .notNull(),
        quantity: integer("quantity").notNull().default(1),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => {
        return {
            cartIdIdx: uniqueIndex("cart_id_idx").on(table.cartId),
            pk: primaryKey({ columns: [table.cartId, table.productId] }),
        };
    },
);

