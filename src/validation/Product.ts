import { z } from "zod";

export const ProductSchema = {
    addProduct: z.object({
        productName: z.string({
            required_error: "productName is required.",
            invalid_type_error: "productName must be a string.",
        }),
        description: z.string({
            required_error: "description is required.",
            invalid_type_error: "description must be a string",
        }),
        price: z.string({
            required_error: "price is required.",
        }),
        quantityInKg: z.number({
            required_error: "Product quantity must be required.",
        }),
        categoryId: z.string().uuid("Invalid category ID format").optional(),
    }),
};
