import { Request, Response, NextFunction } from "express";
import { cartItemTable, cartTable } from "../schema/Cart";
import db from "../config/database";
import { eq } from "drizzle-orm";
import { successResponse } from "./utils";
import { IRequestWithLocal } from "../library/types";
import { SelectUser } from "../schema";

export const retrieveCart = async (
    req: Request,
    res: Response,
): Promise<any> => {
    const { userId } = req.params;

    const userCart = await db.query.cartTable.findFirst({
        where: eq(cartTable.userId, userId),
        columns: {
            id: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
        with: {
            items: {
                columns: {
                    productId: true,
                },
                with: {
                    product: {
                        columns: {
                            categoryId: false,
                        },
                        with: {
                            category: true,
                        },
                    },
                },
            },
        },
    });

    return successResponse(res, userCart, 200, "Cart retrieved successfully");
};

export const addCartItem = async (
    req: Request,
    res: Response,
): Promise<any> => {
    const { cartId } = req.params;

    const { productId, quantity } = req.body;

    const cart = await db
        .insert(cartItemTable)
        .values({ productId, quantity, cartId })
        .execute();

    return successResponse(res, cart, 201, "Item added to cart successfully");
};

export const updateCartItem = async (
    req: Request,
    res: Response,
): Promise<any> => {
    const { itemId } = req.params;

    const { quantity } = req.body;

    const cart = await db
        .update(cartItemTable)
        .set({ quantity })
        .where(eq(cartItemTable.id, itemId))
        .execute();

    return successResponse(res, cart, 200, "Item updated successfully");
};

export const deleteCartItem = async (
    req: Request,
    res: Response,
): Promise<any> => {
    const { itemId } = req.params;

    const cart = await db
        .delete(cartItemTable)
        .where(eq(cartItemTable.id, itemId))
        .execute();

    return successResponse(res, cart, 204, "Item deleted successfully");
};

export const clearCart = async (req: Request, res: Response): Promise<any> => {
    const { cartId } = req.params;

    const cart = await db
        .delete(cartItemTable)
        .where(eq(cartItemTable.cartId, cartId))
        .execute();

    return successResponse(res, cart, 204, "Cart cleared successfully");
};

export const getCartTotal = async (
    req: Request,
    res: Response,
): Promise<any> => {
    const { cartId } = req.params;

    const cart = await db.query.cartItemTable.findMany({
        where: eq(cartItemTable.cartId, cartId),
        columns: {
            productId: true,
            quantity: true,
        },
        with: {
            product: {
                columns: {
                    price: true,
                },
            },
        },
    });

    const total = cart.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
    }, 0);

    return successResponse(
        res,
        { total },
        200,
        "Cart total retrieved successfully",
    );
};

export const createCartForUser = async (req: IRequestWithLocal, res: Response, next: NextFunction) => {
    const user: SelectUser = req.local?.user;

    if (!user) {
        new Error("createCartForUser expects user to be in the request.local object");
    }

    await db.insert(cartTable).values({ userId: user.id}).execute();

    next();
}