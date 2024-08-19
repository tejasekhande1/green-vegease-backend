import { ZodObject } from "zod";
import { NextFunction, Request, Response } from "express";
import Logging from "../library/Logging";
import { AuthRequestSchemas } from "./Auth";

const ValidateZod = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            Logging.error(error);
            return res.status(422).json({ error: error.errors });
        }
    };
};

const RequestSchemas = {
    auth: AuthRequestSchemas,
}

export {ValidateZod, RequestSchemas};