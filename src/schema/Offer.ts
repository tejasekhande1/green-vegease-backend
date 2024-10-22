import {
    uuid,
    pgTable,
    varchar,
    timestamp,
    pgEnum,
    integer,
} from "drizzle-orm/pg-core";

export enum DiscountTypeEnum {
    PERCENTAGE = "percentage",
    FLAT = "flat",
}

export const discountTypeEnum = pgEnum("discount_type", ["percentage", "flat"]);

export const offerTable = pgTable("offer", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    discountType: discountTypeEnum("discount_type").default(
        DiscountTypeEnum.PERCENTAGE,
    ),
    discountValue: integer("discount_value").notNull(),
    startDate: timestamp("started_at", { mode: "date" }).notNull(),
    endDate: timestamp("ended_at", { mode: "date" }).notNull(),
});

export type InsertOffer = typeof offerTable.$inferInsert;
export type SelectOffer = typeof offerTable.$inferSelect;
