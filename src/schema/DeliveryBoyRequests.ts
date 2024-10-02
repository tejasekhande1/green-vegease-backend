import { text, timestamp, pgTable, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";
import db from "../config/database";

export enum DeliveryBoyRequestStatusEnum {
    ACCEPTED = 'accepted',
    PENDING = 'pending',
    CANCELED = 'canceled'
}

export const deliveryBoyRequestStatusEnum = pgEnum("request_status", ["accepted", "pending","canceled"]);

export const deliveryBoyRequestsTable = pgTable("delivery_boy_request", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
    profilePicture: text("profile_picture"),
    requestStatus: deliveryBoyRequestStatusEnum("request_status")
        .default(DeliveryBoyRequestStatusEnum.PENDING)
        .notNull(),
    requestedAt: timestamp("requested_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertDeliveryBoyRequest = typeof deliveryBoyRequestsTable.$inferInsert;
export type SelectDeliveryBoyRequest = typeof deliveryBoyRequestsTable.$inferSelect;

export async function insertDeliveryBoyRequest(delivery_boy_request: InsertDeliveryBoyRequest): Promise<SelectDeliveryBoyRequest[]> {
    return db.insert(deliveryBoyRequestsTable).values(delivery_boy_request).returning();
}
