import { z } from "zod";
import { deleteProduct } from "../controllers/Product";

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
        categoryId: z.string().uuid("Invalid category ID format").optional(),
    }),
};
