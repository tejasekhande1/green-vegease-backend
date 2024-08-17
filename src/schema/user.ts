import { text, timestamp, pgTable, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";

export enum UserRoleEnum {
    ADMIN = "admin",
    CUSTOMER = "customer",
}

export const userRoleEnum = pgEnum("user_role", Object.values(UserRoleEnum));

export const userTable = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 255 }).notNull(),
    role: userRoleEnum("role").default(UserRoleEnum.CUSTOMER),
    profilePicture: text("profile_picture"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;