import { z } from "zod";
import {
    isCartExists,
    isCartItemExists,
    isProductExists,
    isUserExists,
} from "../controllers/utils";

export const cartSchema = {
    retrieveCart: z.object({}),
    addCartItem: z.object({
        productId: z
            .string({
                required_error: "productId is required.",
                invalid_type_error: "productId must be a string.",
            })
            .uuid({
                message: "productId must be a valid UUID.",
            })
            .refine(isProductExists, {
                message: "Product not found.",
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

export const paramsSchema = {
    retrieveCart: z.object({
        userId: z
            .string({
                required_error: "userId is required.",
                invalid_type_error: "userId must be a string.",
            })
            .uuid({
                message: "userId must be a valid UUID.",
            })
            .refine(isUserExists, {
                message: "User not found.",
            }),
    }),
    addCartItem: z.object({
        cartId: z
            .string({
                required_error: "cartId is required.",
                invalid_type_error: "cartId must be a string.",
            })
            .uuid({
                message: "cartId must be a valid UUID.",
            })
            .refine(isCartExists, {
                message: "Cart not found.",
            }),
    }),
    updateCartItem: z.object({
        cartId: z
            .string({
                required_error: "cartId is required.",
                invalid_type_error: "cartId must be a string.",
            })
            .uuid({
                message: "cartId must be a valid UUID.",
            })
            .refine(isCartExists, {
                message: "Cart not found.",
            }),
        itemId: z
            .string({
                required_error: "itemId is required.",
                invalid_type_error: "itemId must be a string.",
            })
            .uuid({
                message: "itemId must be a valid UUID.",
            })
            .refine(isCartItemExists, {
                message: "Cart item not found.",
            }),
    }),
    deleteCartItem: z.object({
        cartId: z
            .string({
                required_error: "cartId is required.",
                invalid_type_error: "cartId must be a string.",
            })
            .uuid({
                message: "cartId must be a valid UUID.",
            })
            .refine(isCartExists, {
                message: "Cart not found.",
            }),
        itemId: z
            .string({
                required_error: "itemId is required.",
                invalid_type_error: "itemId must be a string.",
            })
            .uuid({
                message: "itemId must be a valid UUID.",
            })
            .refine(isCartItemExists, {
                message: "Cart item not found.",
            }),
    }),
    clearCart: z.object({
        cartId: z
            .string({
                required_error: "cartId is required.",
                invalid_type_error: "cartId must be a string.",
            })
            .uuid({
                message: "cartId must be a valid UUID.",
            })
            .refine(isCartExists, {
                message: "Cart not found.",
            }),
    }),
    getCartTotal: z.object({
        cartId: z
            .string({
                required_error: "cartId is required.",
                invalid_type_error: "cartId must be a string.",
            })
            .uuid({
                message: "cartId must be a valid UUID.",
            })
            .refine(isCartExists, {
                message: "Cart not found.",
            }),
    }),
};
