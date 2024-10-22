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
        const offers = await db
            .select()
            .from(offerTable)
            .orderBy(offerTable.startDate);

        return successResponse(
            res,
            offers,
            200,
            "Offers retrieved successfully",
        );
    } catch (error) {
        return errorResponse(res, "Failed to retrieve offers.", error, 500);
    }
};

export const updateOffer = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { id } = req.params;
    const { name, discountType, discountValue, startDate, endDate } = req.body;

    try {
        const existingOffer = await db
            .select({ id: offerTable.id })
            .from(offerTable)
            .where(eq(offerTable.id, id))
            .limit(1);

        if (existingOffer.length === 0) {
            return errorResponse(res, "Offer not found.", null, 404);
        }

        const updatedOffer = await db
            .update(offerTable)
            .set({
                name,
                discountType,
                discountValue,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            })
            .where(eq(offerTable.id, id))
            .returning();

        return successResponse(
            res,
            updatedOffer,
            200,
            "Offer updated successfully",
        );
    } catch (error) {
        return errorResponse(res, "Failed to update offer.", error, 500);
    }
};

export const deleteOffer = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { id } = req.params;

    try {
        const existingOffer = await db
            .select({ id: offerTable.id })
            .from(offerTable)
            .where(eq(offerTable.id, id))
            .limit(1);

        if (existingOffer.length === 0) {
            return errorResponse(res, "Offer not found.", null, 404);
        }

        await db
            .delete(offerTable)
            .where(eq(offerTable.id, id));

        return successResponse(res, null, 200, "Offer deleted successfully");
    } catch (error) {
        return errorResponse(res, "Failed to delete offer.", error, 500);
    }
};

export const getOfferById = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { id } = req.params;

    try {
        const offer = await db
            .select()
            .from(offerTable)
            .where(eq(offerTable.id, id))
            .limit(1);

        if (offer.length === 0) {
            return errorResponse(res, "Offer not found.", null, 404);
        }

        return successResponse(res, offer[0], 200, "Offer retrieved successfully");
    } catch (error) {
        return errorResponse(res, "Failed to retrieve offer.", error, 500);
    }
};