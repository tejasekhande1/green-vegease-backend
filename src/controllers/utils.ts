import { Request, Response, NextFunction } from "express";
import db from "../config/database";
import { eq, and } from "drizzle-orm";

import { userTable } from "../schema/Auth";
import { cartItemTable, cartTable } from "../schema/Cart";
import { productTable } from "../schema/Product";
import { IRequestWithLocal } from "../library/types";

type ControllerFunction = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<any> | any;

export const asyncErrorHandler =
    (fn: ControllerFunction) =>
    (req: Request | IRequestWithLocal, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export const successResponse = (
    res: Response,
    data: any,
    statusCode: 200 | 201 | 204 = 200,
    message: string = "Success",
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (
    res: Response,
    message = "Error",
    error: any = null,
) => {
    return res.status(500).json({
        success: false,
        message,
        error,
    });
};

export const isUserExists = async (userId: string): Promise<boolean> => {
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.id, userId),
    });

    if (user === undefined) {
        return false;
    }

    return true;
};

export const isCartExists = async (cartId: string): Promise<boolean> => {
    const cart = await db.query.cartTable.findFirst({
        where: eq(cartTable.id, cartId),
    });

    if (cart === undefined) {
        return false;
    }

    return true;
};

export const isProductExists = async (productId: string): Promise<boolean> => {
    const product = await db.query.productTable.findFirst({
        where: eq(productTable.id, productId),
    });

    if (product === undefined) {
        return false;
    }

    return true;
};

export const isCartItemExists = async (cartItemId: string): Promise<boolean> => {
    const cartItem = await db.query.cartItemTable.findFirst({
        where: eq(cartItemTable.id, cartItemId),
    });

    if (cartItem === undefined) {
        return false;
    }

    return true;
}

export const isCartProductExists = async (cartId: string, productId: string): Promise<boolean> => {
    const cartItem = await db
        .select({ productId: cartItemTable.productId })
        .from(cartItemTable)
        .where(
            and(
                eq(cartItemTable.cartId, cartId),
                eq(cartItemTable.productId, productId),
            ),
        )
        .limit(1);

    if (cartItem.length === 0) {
        return false;
    }

    return true;
};
