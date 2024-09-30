import { z } from "zod";
import {
    isCartExists,
    isCartItemExists,
    isProductExists,
    isUserExists,
} from "../controllers/utils";
import { customUUID } from "./utils";

const bodySchema = {
    retrieveCart: z.object({}),
    addCartItem: z.object({
        productId: customUUID({
            fieldName: "productId",
            refineFn: isProductExists,
        }),
        quantity: z
            .number({
                required_error: "quantity is required.",
                invalid_type_error: "quantity must be a number.",
            })
            .nonnegative({
                message: "quantity must be a non-negative number.",
            })
            .gt(0),
    }),
    updateCartItem: z.object({
        quantity: z
            .number({
                required_error: "quantity is required.",
                invalid_type_error: "quantity must be a number.",
            })
            .nonnegative({
                message: "quantity must be a non-negative number.",
            })
            .gt(0),
    }),
    deleteCartItem: z.object({}),
    clearCart: z.object({}),
    getCartTotal: z.object({}),
};

const paramsSchema = {
    retrieveCart: z.object({
        userId: customUUID({
            fieldName: "userId",
            refineFn: isUserExists,
        }),
    }),
    addCartItem: z.object({
        cartId: customUUID({
            fieldName: "cartId",
            refineFn: isCartExists,
        }),
    }),
    updateCartItem: z.object({
        cartId: customUUID({
            fieldName: "cartId",
            refineFn: isCartExists,
        }),
        itemId: customUUID({
            fieldName: "itemId",
            refineFn: isCartItemExists,
        }),
    }),
    deleteCartItem: z.object({
        cartId: customUUID({
            fieldName: "cartId",
            refineFn: isCartExists,
        }),
        itemId: customUUID({
            fieldName: "itemId",
            refineFn: isCartItemExists,
        }),
    }),
    clearCart: z.object({
        cartId: customUUID({
            fieldName: "cartId",
            refineFn: isCartExists,
        }),
    }),
    getCartTotal: z.object({
        cartId: customUUID({
            fieldName: "cartId",
            refineFn: isCartExists,
        }),
    }),
};

export const cartSchema = { bodySchema, paramsSchema };
