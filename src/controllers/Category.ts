import { Request, Response } from "express";
import db from "../config/database";
import { categoryTable, insertCategory } from "../schema/Category";
import { and, eq } from "drizzle-orm";
import { log } from "console";

export const createCategory = async(req:Request,res:Response) : Promise<Response> => {
    const {categoryName} = req.body;

    try{
        const existingCategory = await db.select({
            category_name:categoryTable.categoryName
        })
        .from(categoryTable)
        .where(eq(categoryTable.categoryName,categoryName));

        if(existingCategory){
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        const category = await insertCategory({
            categoryName:categoryName
        })

        console.log("Category -> ",category);
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Failed to create category.",
        })
    }
    return res.status(200).json({
        success:true,
        message:"Category created successfully."
    });
}