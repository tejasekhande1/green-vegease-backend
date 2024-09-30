import z, { unknown } from "zod";
import { NextFunction, Request, Response } from "express";
import { AuthRequestSchemas } from "./Auth";
import { CategorySchema } from "./Category";
import { ProductSchema } from "./Product";
import { cartSchema } from "./Cart";

const ValidateZod = (
    schema: z.ZodObject<any>,
    requestAttr: "body" | "params" = "body",
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req[requestAttr]);
            next();
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map((err) => err.message);
                return res.status(422).json({
                    success: false,
                    message: errorMessages.join(", "),
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        }
    };
};

const RequestSchemas = {
    auth: AuthRequestSchemas,
    category: CategorySchema,
    product: ProductSchema,
    cart: cartSchema.bodySchema,
};

const ParamsSchemas = {
    cart: cartSchema.paramsSchema,
};

function customUUID(options: {
    fieldName: string;
    refineFn: (uuid: string) => Promise<boolean> | boolean;
}) {
    return z
        .string({
            required_error: `${options.fieldName} is required.`,
            invalid_type_error: `${options.fieldName} must be a string.`,
        })
        .uuid(`${options.fieldName} must be a valid UUID.`)
        .refine(options.refineFn, {
            message: `${options.fieldName} not found.`,
        });
}
export { ValidateZod, RequestSchemas, ParamsSchemas, customUUID };
