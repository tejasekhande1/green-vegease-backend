import { relations } from 'drizzle-orm';
import { userTable } from '././Auth';
import { cartTable, cartItemTable } from './Cart';
import { productTable } from './Product';
import { categoryTable } from './Category';
import { productOfferTable } from './ProductOffer';
import { offerTable } from './Offer';

export const userRelations = relations(userTable, ({ one }) => ({
    cart: one(cartTable, {
        fields: [userTable.id],
        references: [cartTable.userId],
    }),
}));

export const productRelations = relations(productTable, ({ one }) => ({
    category: one(categoryTable, {
        fields: [productTable.categoryId],
        references: [categoryTable.id],
    }),
}));

export const categoryRelations = relations(categoryTable, ({ many }) => ({
    products: many(productTable),
}));

export const cartRelations = relations(cartTable, ({ one, many }) => ({
    user: one(userTable, {
        fields: [cartTable.userId],
        references: [userTable.id],
    }),
    items: many(cartItemTable),
}));

export const cartItemRelations = relations(cartItemTable, ({ one, many }) => ({
    cart: one(cartTable, {
        fields: [cartItemTable.cartId],
        references: [cartTable.id],
    }),
    product: one(productTable, {
        fields: [cartItemTable.productId],
        references: [productTable.id],
    }),
}));

export const productOfferRelations = relations(
    productOfferTable,
    ({ one, many }) => ({
        offer: one(offerTable, {
            fields: [productOfferTable.offerId],
            references: [offerTable.id],
        }),
        product: many(productTable),
    }),
);