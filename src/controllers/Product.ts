import express, { Request, Response } from "express";
import { config } from "../config/config";
import { uploadToCloudinary } from "../services/uploadImage";
import { productTable, insertProduct } from "../schema/Product";
import { z } from "zod";


const productSchema = z.object({
    productName: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be a positive number"),
    categoryId: z.string().uuid("Invalid category ID format").optional(),
  });
  
  export const addProduct = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { folder } = config.cloudinary;
    const parsedBody = productSchema.safeParse(req.body);
    
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
        errors: parsedBody.error.errors,
      });
    }
  
    const { productName, description, price, categoryId } = parsedBody.data;
  
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || !files["image"]) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }
  
    const imageFile = files["image"]
  
    try {
      const imageUrl = await uploadToCloudinary(imageFile, folder, 1000, 1000);
      if (!imageUrl) {
        throw new Error("Image upload failed");
      }
  
      const product = await insertProduct({
          productName,
          description,
          price,
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
        message: error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  };