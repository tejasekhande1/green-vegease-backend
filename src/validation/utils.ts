import { ZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import Logging from "../library/Logging";
import { AuthRequestSchemas } from "./Auth";

const ValidateZod = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error:any) {
            if (error instanceof ZodError) {
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
};

export { ValidateZod, RequestSchemas };
