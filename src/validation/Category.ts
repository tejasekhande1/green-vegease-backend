import { z } from "zod";

export const CategorySchema = {
    category: z.object({
        categoryName: z.string({
            required_error: "categoryName is required.",
            invalid_type_error: "categoryName must be a string."
        }),
    })
};