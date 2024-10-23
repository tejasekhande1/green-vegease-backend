import { Request, Response } from "express";
import { config } from "../config/config";
import { uploadToCloudinary } from "../services/uploadImage";
import { productTable } from "../schema/Product";
import { insertProduct } from "../schema/utils";
import db from "../config/database";
import { categoryTable } from "../schema/Category";
import { eq, and } from "drizzle-orm";
import { errorResponse, successResponse } from "./utils";
import { offerTable } from "../schema/Offer";
import { productOfferTable } from "../schema/ProductOffer";

export const addProduct = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { folder } = config.cloudinary;
    const { productName, description, price, quantityInKg, categoryId } =
        req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const productPrice = parseInt(price);

    if (!files || !files["image"]) {
        return res.status(400).json({
            success: false,
            message: "No image file provided",
        });
    }

    const imageFile = files["image"];

    try {
        const imageUrl = await uploadToCloudinary(
            imageFile,
            folder,
            1000,
            1000,
        );
        if (!imageUrl) {
            throw new Error("Image upload failed");
        }

        const product = await insertProduct({
            name: productName,
            description,
            price: productPrice,
            images: imageUrl,
            categoryId,
            quantityInKg,
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully.",
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
};

export const getProducts = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const { category } = req.query;

        const baseQuery = db
            .select({
                id: productTable.id,
                name: productTable.name,
                description: productTable.description,
                price: productTable.price,
                images: productTable.images,
                categoryId: productTable.categoryId,
                categoryName: categoryTable.name,
                quantityInKg: productTable.quantityInKg,
            })
            .from(productTable)
            .leftJoin(
                categoryTable,
                eq(productTable.categoryId, categoryTable.id),
            );

        let productsQuery;

        if (category) {
            productsQuery = baseQuery.where(
                eq(categoryTable.name, String(category)),
            );
        } else {
            productsQuery = baseQuery;
        }

        const products = await productsQuery;

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: (error as Error).message,
        });
    }
};

// TODO : Think about image of this product should be delete from cloudinary
export const deleteProduct = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { id } = req.params;
    try {
        const [deletedProduct] = await db
            .delete(productTable)
            .where(eq(productTable.id, id));

        if (!deleteProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete a product",
        });
    }
};

export const updateProduct = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { id } = req.params;
    const { productName, description, price, categoryId, quantityInKg } =
        req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
        const [existingProduct] = await db
            .select()
            .from(productTable)
            .where(eq(productTable.id, id));

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let imageUrl = existingProduct.images;

        if (files && files["image"]) {
            const imageFile = files["image"];
            imageUrl =
                (await uploadToCloudinary(
                    imageFile,
                    config.cloudinary.folder,
                    1000,
                    1000,
                )) || null;
            if (!imageUrl) {
                throw new Error("Image upload failed");
            }
        }

        const updatedProduct = await db
            .update(productTable)
            .set({
                name: productName,
                description,
                price,
                categoryId,
                images: imageUrl,
                quantityInKg,
            })
            .where(eq(productTable.id, id));

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
};

export const addProductsToOffer = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { offerId, products } = req.body;
    try {
        const existingOffers = await db
            .select()
            .from(offerTable)
            .where(eq(offerTable.id, offerId))
            .limit(1);

        if (existingOffers.length === 0) {
            return errorResponse(res, "This offer does not exist", null, 404);
        }

        const offerProductEntries = products.map((productId: number) => ({
            offerId: offerId,
            productId: productId,
        }));

        const addProductsInOffer = await db
            .insert(productOfferTable)
            .values(offerProductEntries)
            .returning();

        return successResponse(
            res,
            addProductsInOffer,
            201,
            "Products added to the offer successfully",
        );
    } catch (error) {
        return errorResponse(
            res,
            "An error occurred while adding products to the offer",
            error,
            500,
        );
    }
};

export const deleteProductFromOffer = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { offerId, productId } = req.params;

    try {
        const existingOffers = await db
            .select()
            .from(offerTable)
            .where(eq(offerTable.id, offerId))
            .limit(1);

        if (existingOffers.length === 0) {
            return errorResponse(res, "This offer does not exist", null, 404);
        }

        const deleteProduct = await db
            .delete(productOfferTable)
            .where(
                and(
                    eq(productOfferTable.offerId, offerId),
                    eq(productOfferTable.productId, productId),
                ),
            )
            .returning();

        if (deleteProduct.length === 0) {
            return errorResponse(
                res,
                "This product was not found in the specified offer",
                null,
                404,
            );
        }

        return successResponse(
            res,
            deleteProduct,
            200,
            "Product deleted from the offer successfully",
        );
    } catch (error) {
        return errorResponse(
            res,
            "An error occurred while deleting the product from the offer",
            error,
            500,
        );
    }
};

export const getProductsWithOffers = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const offersWithProducts = await db
            .select({
                offerId: offerTable.id,
                offerName: offerTable.name,
                productId: productTable.id,
                productName: productTable.name,
                productDescription: productTable.description,
            })
            .from(offerTable)
            .leftJoin(
                productOfferTable,
                eq(offerTable.id, productOfferTable.offerId)
            )
            .leftJoin(
                productTable,
                eq(productOfferTable.productId, productTable.id)
            );

        const groupedOffers: { [key: string]: any[] } = {};
        offersWithProducts.forEach((row) => {
            const { offerName, productId, productName, productDescription } = row;

            if (!groupedOffers[offerName]) {
                groupedOffers[offerName] = [];
            }

            if (productId) {
                groupedOffers[offerName].push({
                    productId,
                    productName,
                    productDescription,
                });
            }
        });

        return successResponse(
            res,
            groupedOffers,
            200,
            "Offers with their associated products retrieved successfully"
        );
    } catch (error) {
        return errorResponse(
            res,
            "An error occurred while retrieving products with offers",
            error,
            500
        );
    }
};