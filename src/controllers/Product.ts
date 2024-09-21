import { Request, Response } from "express";
import { config } from "../config/config";
import { uploadToCloudinary } from "../services/uploadImage";
import { insertProduct, productTable } from "../schema/Product";
import db from "../config/database";
import { categoryTable } from "../schema/Category";
import { eq } from "drizzle-orm";

export const addProduct = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { folder } = config.cloudinary;
    const { productName, description, price, categoryId } = req.body;

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
            productName,
            description,
            price: productPrice,
            images: imageUrl,
            categoryId,
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

// TODO : Need to optimized this i tried but getting some error in 'where' clause
export const getProducts = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const { category } = req.query;

        let baseQuery;

        if (!category) {
            baseQuery = db
                .select({
                    id: productTable.id,
                    productName: productTable.productName,
                    description: productTable.description,
                    price: productTable.price,
                    images: productTable.images,
                    categoryId: productTable.categoryId,
                    categoryName: categoryTable.categoryName,
                })
                .from(productTable)
                .leftJoin(
                    categoryTable,
                    eq(productTable.categoryId, categoryTable.id),
                );
        }

        if (category) {
            baseQuery = db
                .select({
                    id: productTable.id,
                    productName: productTable.productName,
                    description: productTable.description,
                    price: productTable.price,
                    images: productTable.images,
                    categoryId: productTable.categoryId,
                    categoryName: categoryTable.categoryName,
                })
                .from(productTable)
                .leftJoin(
                    categoryTable,
                    eq(productTable.categoryId, categoryTable.id),
                )
                .where(eq(categoryTable.categoryName, String(category)));
        }

        const products = await baseQuery;

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
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
    const { productName, description, price, categoryId } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
        const [existingProduct] = await db
            .select()
            .from(productTable)
            .where(eq(productTable.id, id));

        console.log("Existed Product -> ", existingProduct);

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
                productName,
                description,
                price,
                categoryId,
                images: imageUrl,
            })
            .where(eq(productTable.id, id));

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
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
