import { Request, Response } from "express";
import db from "../config/database";
import { offerTable } from "../schema/Offer";
import { eq } from "drizzle-orm";
import { errorResponse, successResponse } from "./utils";

export const addOffer = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { name, discountType, discountValue, startDate, endDate } = req.body;

    try {
        const existingOffer = await db
            .select({ id: offerTable.id })
            .from(offerTable)
            .where(eq(offerTable.name, name))
            .limit(1);

        if (existingOffer.length > 0) {
            return errorResponse(res, "Offer already existed.", null, 400);
        }

        const newOffer = await db
            .insert(offerTable)
            .values({
                name,
                discountType,
                discountValue,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            })
            .returning();

        return successResponse(res, newOffer, 201, "Offer added successfully");
    } catch (error) {
        return errorResponse(res, "Failed to add offer.", error, 500);
    }
};

export const getOffers = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const offers = await db.select().from(offerTable);
        return successResponse(res, offers, 200, "Offers fetched successfully");
    } catch (error) {
        return errorResponse(res, "Failed to fetch offers", error, 500);
    }
};
