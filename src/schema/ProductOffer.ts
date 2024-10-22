import { pgTable, uuid } from "drizzle-orm/pg-core";
import { productTable } from "./Product";
import { offerTable } from "./Offer";

export const productOfferTable = pgTable("product_offer", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => productTable.id),
    offerId: uuid("offer_id").references(() => offerTable.id),
});

export type InsertProductOffer = typeof productOfferTable.$inferInsert;
export type SelectProductOffer = typeof productOfferTable.$inferSelect;
