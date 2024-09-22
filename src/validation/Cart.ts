import { z } from "zod";

export const cartSchemas = {
    retrieveCart: z.object({}),
    addCartItem: z.object({
        productId: z.string({
            required_error: "productId is required.",
            invalid_type_error: "productId must be a string.",
        }),
        quantity: z.number({
            required_error: "quantity is required.",
            invalid_type_error: "quantity must be a number.",
        }),
    }),
    updateCartItem: z.object({
        quantity: z.number({
            required_error: "quantity is required.",
            invalid_type_error: "quantity must be a number.",
        }),
    }),
    deleteCartItem: z.object({}),
    clearCart: z.object({}),
    getCartTotal: z.object({}),
}