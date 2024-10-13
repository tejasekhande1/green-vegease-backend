import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../controllers/utils";
import { IRequestWithLocal } from "./types";
import { UserRoleEnum } from "../schema";
import Logging from "./Logging";

export interface ITokenPayload {
    id: string;
    email: string;
    role: UserRoleEnum | null;
}

export const generateAuthToken = (userData: ITokenPayload): string => {
    return jwt.sign(userData, config.core.jwtSecret, {
        expiresIn: "1d",
    });
};

export const verifyAuthToken = (token: string): ITokenPayload => {
    return jwt.verify(token, config.core.jwtSecret) as ITokenPayload;
};

export const authorization = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return errorResponse(res, "No Authorization token provided", null, 401);
    }

    try {
        const user = verifyAuthToken(token);
        (req as IRequestWithLocal).local = {
            user
        };
        next();
    } catch (error) {
        return errorResponse(
            res,
            "Invalid Authorization token provided",
            null,
            401,
        );
    }
};

/**
 * Middleware to check if the user is an admin
 *
 * Only to called after the `authorization` middleware
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as IRequestWithLocal).local.user;

    if (user.role !== UserRoleEnum.ADMIN) {
        return errorResponse(
            res,
            "You are not authorized to access this resource",
            null,
            403,
        );
    }

    next();
};
