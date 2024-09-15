import { Request, Response } from "express";
import { uploadToCloudinary } from "../services/uploadImage";
import multer, { Multer } from 'multer';
import { log } from "console";



export const uploadProductImage = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.files) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
  
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFile = files['image'];

      console.log("Image File -> ",files);
      

      console.log("Image -> ",imageFile);
  
      // Call the upload function
      const image = await uploadToCloudinary(
        imageFile,
        process.env.CLOUDINARY_FOLDER,
        1000,
        1000
      );
  
      return res.status(200).json({
        success: true,
        message: 'Image Updated successfully',
        data: image,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image',
        });
      }
    }
  };
  