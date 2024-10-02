import { Request, Response } from "express";
import db from "../config/database";
import { categoryTable, insertCategory } from "../schema/Category";
import { eq } from "drizzle-orm";
import { config } from "../config/config";
import { uploadToCloudinary } from "../services/uploadImage";

export const createCategory = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { categoryName } = req.body;
    const { folder } = config.cloudinary;
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files["image"]) {
        return res.status(400).json({
            success: false,
            message: "No image file provided",
        });
    }

    const imageFile = files["image"];
    let category;

    try {
        const [existingCategory] = await db
            .select({
                category_name: categoryTable.categoryName,
            })
            .from(categoryTable)
            .where(eq(categoryTable.categoryName, categoryName));

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        const imageUrl = await uploadToCloudinary(
            imageFile,
            folder,
            1000,
            1000,
        );

        if (!imageUrl) {
            throw new Error("Image upload failed");
        }

        category = await insertCategory({
            categoryName: categoryName,
            image: imageUrl,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create category.",
        });
    }
    return res.status(200).json({
        success: true,
        message: "Category created successfully.",
        data: category,
    });
};

export const updateCategory = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { id } = req.params;
    const { categoryName } = req.body;

    try {
        const [existingCategory] = await db
            .select({
                categoryName: categoryTable.categoryName,
            })
            .from(categoryTable)
            .where(eq(categoryTable.categoryName, categoryName));

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category with this name already exists",
            });
        }
        
        const [updatedCategory] = await db
            .update(categoryTable)
            .set({ categoryName: categoryName })
            .where(eq(categoryTable.id, id))
            .returning({
                id: categoryTable.id,
                categoryName: categoryTable.categoryName,
                categoryImage: categoryTable.image,
            });
;

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            data: updatedCategory,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update category.",
        });
    }
};

export const deleteCategory = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { id } = req.params;

    try {
        const [deletedCategory] = await db
            .delete(categoryTable)
            .where(eq(categoryTable.id, id));

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete category.",
        });
    }
};

export const getAllCategories = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const categories = await db.select().from(categoryTable);

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No categories found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve categories.",
        });
    }
};
