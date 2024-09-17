import express from "express";
import { uploadProductImage } from "../controllers/ImageUpload";
import { addProduct } from "../controllers/Product";
import { RequestSchemas, ValidateZod } from "../validation/utils";
const router = express.Router();

router.post("/", ValidateZod(RequestSchemas.product.product), addProduct);

export default router;