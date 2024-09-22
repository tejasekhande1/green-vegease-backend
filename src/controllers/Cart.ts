import { Request, Response, NextFunction } from "express";
import { cartItemTable, cartTable } from "../schema/Cart";
import db from "../config/database";
import { eq } from "drizzle-orm";

export const retrieveCart = async (
    req: Request,
    res: Response,
): Promise<void> => {
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

    res.status(200).json({ userCart });
};
