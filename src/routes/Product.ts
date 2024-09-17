import express from "express";
import { uploadProductImage } from "../controllers/ImageUpload";
import { addProduct, deleteProduct, getProducts } from "../controllers/Product";
import { RequestSchemas, ValidateZod } from "../validation/utils";
const router = express.Router();

/**
 * @swagger
 * /api/v1/product:
 *   post:
 *     summary: Add a new product
 *     description: This endpoint allows you to add a new product with an image, name, description, price, and category.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: "The name of the product"
 *                 example: "Laptop"
 *               description:
 *                 type: string
 *                 description: "A brief description of the product"
 *                 example: "A high-performance laptop for gaming and work."
 *               price:
 *                 type: string
 *                 description: "The price of the product in numeric format"
 *                 example: "1200"
 *               categoryId:
 *                 type: string
 *                 description: "The ID of the category the product belongs to"
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: "Image file of the product"
 *             required:
 *               - productName
 *               - description
 *               - price
 *               - categoryId
 *               - image
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product added successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     productName:
 *                       type: string
 *                       example: "Laptop"
 *                     description:
 *                       type: string
 *                       example: "A high-performance laptop for gaming and work."
 *                     price:
 *                       type: number
 *                       example: 1200
 *                     images:
 *                       type: string
 *                       example: "https://cloudinary.com/laptop.jpg"
 *                     categoryId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: No image file provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No image file provided"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/", ValidateZod(RequestSchemas.product.product), addProduct);

router.get("/", getProducts);

router.delete("/:id", deleteProduct);

export default router;