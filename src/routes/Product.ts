import express from "express";
import upload from "../middleware/multer";
import { uploadProductImage } from "../controllers/ImageUpload";
import { addProduct } from "../controllers/Product";
const router = express.Router();

router.post('/images',uploadProductImage);

router.post('/',addProduct);

export default router;