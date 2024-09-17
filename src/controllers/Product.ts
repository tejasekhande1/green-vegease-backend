import { Request, Response } from "express";
import { config } from "../config/config";
import { uploadToCloudinary } from "../services/uploadImage";
import { insertProduct } from "../schema/Product";

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
