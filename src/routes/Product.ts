import express from "express";
import upload from "../middleware/multer";
import { uploadProductImage } from "../controllers/ImageUpload";
const router = express.Router();

router.post('/images',uploadProductImage);

export default router;