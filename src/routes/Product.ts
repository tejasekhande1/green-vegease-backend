import express from "express";
import {
    addProduct,
    addProductsToOffer,
    deleteProduct,
    deleteProductFromOffer,
    getProducts,
    getProductsWithOffers,
    updateProduct,
} from "../controllers/Product";
import { RequestSchemas, ValidateZod } from "../validation/utils";
import { authorization, isAdmin } from "../library/authorization";
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
 *                 description: "The price of the product in string format"
 *                 example: "1200"
 *               quantityInKg:
 *                 type: number
 *                 description: "The quantity of the product in numeric format"
 *                 example: 20
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
 *               - quantityInKg
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
router.post(
    "/",
    authorization,
    ValidateZod(RequestSchemas.product.addProduct),
    addProduct,
);

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
router.get("/", authorization, getProducts);

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
router.delete("/:id", authorization, deleteProduct);

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
router.put("/:id", authorization, updateProduct);

/**
 * @swagger
 * /api/v1/product/offer:
 *   post:
 *     summary: Add products to an existing offer
 *     description: Links an array of product IDs to a specified offer by its ID.
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offerId:
 *                 type: string
 *                 description: The ID of the offer to which products will be added.
 *                 example: "offer123"
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: An array of product IDs to add to the offer.
 *                   example: ["product1ID", "product2ID", "product3ID"]
 *     responses:
 *       201:
 *         description: Products added to the offer successfully
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
 *                   example: "Products added to the offer successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "entry123"
 *                       offerId:
 *                         type: string
 *                         example: "offer123"
 *                       productId:
 *                         type: string
 *                         example: "product1"
 *       404:
 *         description: This offer does not exist
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
 *                   example: "This offer does not exist"
 *       500:
 *         description: An error occurred while adding products to the offer
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
 *                   example: "An error occurred while adding products to the offer"
 *                 error:
 *                   type: string
 */
router.post("/offer", authorization, isAdmin, addProductsToOffer);

/**
 * @swagger
 * /offers/{offerId}/{productId}:
 *   delete:
 *     summary: Delete a product from an offer
 *     description: Deletes a specified product from a specific offer by its IDs.
 *     tags: [Offer]
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         description: The ID of the offer to delete the product from.
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to be deleted from the offer.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Assuming you have JWT authentication
 *     responses:
 *       200:
 *         description: Product deleted from the offer successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted from the offer successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     offerId:
 *                       type: string
 *                     productId:
 *                       type: string
 *       404:
 *         description: Offer does not exist or product was not found in the specified offer.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This offer does not exist
 *       500:
 *         description: An error occurred while deleting the product from the offer.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the product from the offer
 */
router.delete(
    "/:offerId/:productId",
    authorization,
    isAdmin,
    deleteProductFromOffer,
);

/**
 * @swagger
 * /products-with-offers:
 *   get:
 *     summary: Get products with associated offers
 *     description: Retrieves a list of offers along with their associated products.
 *     tags: [Offer]
 *     security:
 *       - BearerAuth: []  # Assuming you have JWT authentication
 *     responses:
 *       200:
 *         description: Offers with their associated products retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Offers with their associated products retrieved successfully
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                         productName:
 *                           type: string
 *                         productDescription:
 *                           type: string
 *       500:
 *         description: An error occurred while retrieving products with offers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving products with offers
 */
router.get("/products-with-offers", authorization, getProductsWithOffers);

export default router;