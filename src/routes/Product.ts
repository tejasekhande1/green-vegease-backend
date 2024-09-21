import express from "express";
import { uploadProductImage } from "../controllers/ImageUpload";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../controllers/Product";
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

/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Fetches a list of products from the database. Optionally, you can filter products by category.
 *     tags:
 *      - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         description: The category to filter products by.
 *         required: false
 *         schema:
 *           type: string
 *           example: "Electronics"
 *     responses:
 *       200:
 *         description: Products fetched successfully
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
 *                   example: "Products fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "d0aee4c0-2f6c-4d34-8727-2f5c76cf7c8d"
 *                       productName:
 *                         type: string
 *                         example: "Smartphone"
 *                       description:
 *                         type: string
 *                         example: "Latest model with high resolution camera"
 *                       price:
 *                         type: number
 *                         example: 299.99
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://example.com/image.jpg"
 *                       categoryId:
 *                         type: string
 *                         example: "f1e6e8d4-3b8e-4e9c-bd56-6caa7a6b7c9b"
 *                       categoryName:
 *                         type: string
 *                         example: "Electronics"
 *       500:
 *         description: Failed to fetch products
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
 *                   example: "Failed to fetch products"
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/v1/product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Deletes a product from the database using the provided product ID.
 *     tags:
 *      - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to be deleted.
 *         schema:
 *           type: string
 *           example: "d0aee4c0-2f6c-4d34-8727-2f5c76cf7c8d"
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *                   example: "Product deleted successfully"
 *       404:
 *         description: Product not found
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
 *                   example: "Product not found"
 *       500:
 *         description: Failed to delete a product
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
 *                   example: "Failed to delete a product"
 */
router.delete("/:id", deleteProduct);

/**
 * @swagger
 * /api/v1/product/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Updates the details of an existing product. Optionally, you can upload a new image for the product.
 *     tags:
 *      - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to be updated.
 *         schema:
 *           type: string
 *           example: "d0aee4c0-2f6c-4d34-8727-2f5c76cf7c8d"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 example: "Smartphone"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               price:
 *                 type: number
 *                 example: 349.99
 *               categoryId:
 *                 type: string
 *                 example: "f1e6e8d4-3b8e-4e9c-bd56-6caa7a6b7c9b"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file to upload
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   example: "Product updated successfully"
 *       400:
 *         description: Bad request if validation fails or required fields are missing
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
 *                   example: "Invalid input data"
 *       404:
 *         description: Product not found
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
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error
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
router.put("/:id", updateProduct);

export default router;