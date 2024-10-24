import express from "express";
import { isAdmin, authorization } from "../library/authorization";
import {
    addOffer,
    getOffers,
    updateOffer,
    deleteOffer,
    getOfferById,
    getProductsByOfferId,
} from "../controllers/Offer";
const router = express.Router();

/**
 * @swagger
 * /api/v1/offer:
 *   post:
 *     summary: Add a new offer
 *     description: Creates a new offer with name, discount type, discount value, start date, and end date.
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - discountType
 *               - discountValue
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the offer.
 *                 example: "Special Discount"
 *               discountType:
 *                 type: string
 *                 description: Type of the discount (e.g., percentage, fixed).
 *                 example: "percentage"
 *               discountValue:
 *                 type: number
 *                 description: The discount value.
 *                 example: 20
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Start date of the offer.
 *                 example: "2024-10-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date of the offer.
 *                 example: "2024-12-01"
 *     responses:
 *       201:
 *         description: Offer added successfully
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
 *                   example: "Offer added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       example: "Special Discount"
 *                     discountType:
 *                       type: string
 *                       example: "percentage"
 *                     discountValue:
 *                       type: number
 *                       example: 20
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-10-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-12-01"
 *       400:
 *         description: Offer already exists
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
 *                   example: "Offer already existed."
 *       500:
 *         description: Failed to add offer due to server error
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
 *                   example: "Failed to add offer."
 *                 error:
 *                   type: string
 */
router.post("/", authorization, isAdmin, addOffer);

/**
 * @swagger
 * /api/v1/offer:
 *   get:
 *     summary: Retrieve all offers
 *     description: Fetches a list of all available offers sorted by their start date.
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Offers retrieved successfully
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
 *                   example: "Offers retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "offer123"
 *                       name:
 *                         type: string
 *                         example: "Special Discount"
 *                       discountType:
 *                         type: string
 *                         example: "percentage"
 *                       discountValue:
 *                         type: number
 *                         example: 20
 *                       startDate:
 *                         type: string
 *                         format: date
 *                         example: "2024-10-01"
 *                       endDate:
 *                         type: string
 *                         format: date
 *                         example: "2024-12-01"
 *       500:
 *         description: Failed to retrieve offers due to server error
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
 *                   example: "Failed to retrieve offers."
 *                 error:
 *                   type: string
 */
router.get("/", authorization, getOffers);

/**
 * @swagger
 * /api/v1/offer/{id}:
 *   put:
 *     summary: Update an existing offer
 *     description: Updates the details of an existing offer by its ID.
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the offer to update.
 *         schema:
 *           type: string
 *           example: "offer123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - discountType
 *               - discountValue
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the offer.
 *                 example: "Updated Special Discount"
 *               discountType:
 *                 type: string
 *                 description: Type of the discount (e.g., percentage, fixed).
 *                 example: "fixed"
 *               discountValue:
 *                 type: number
 *                 description: The discount value.
 *                 example: 15
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Start date of the offer.
 *                 example: "2024-11-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date of the offer.
 *                 example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Offer updated successfully
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
 *                   example: "Offer updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "offer123"
 *                     name:
 *                       type: string
 *                       example: "Updated Special Discount"
 *                     discountType:
 *                       type: string
 *                       example: "fixed"
 *                     discountValue:
 *                       type: number
 *                       example: 15
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-11-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-12-31"
 *       404:
 *         description: Offer not found
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
 *                   example: "Offer not found."
 *       500:
 *         description: Failed to update offer due to server error
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
 *                   example: "Failed to update offer."
 *                 error:
 *                   type: string
 */
router.put("/:id", authorization, isAdmin, updateOffer);

/**
 * @swagger
 * /api/v1/offer/{id}:
 *   delete:
 *     summary: Delete an existing offer
 *     description: Deletes an offer by its ID.
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the offer to delete.
 *         schema:
 *           type: string
 *           example: "offer123"
 *     responses:
 *       200:
 *         description: Offer deleted successfully
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
 *                   example: "Offer deleted successfully"
 *       404:
 *         description: Offer not found
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
 *                   example: "Offer not found."
 *       500:
 *         description: Failed to delete offer due to server error
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
 *                   example: "Failed to delete offer."
 *                 error:
 *                   type: string
 */
router.delete("/:id", authorization, isAdmin, deleteOffer);

/**
 * @swagger
 * /api/v1/offer/{id}:
 *   get:
 *     summary: Retrieve a specific offer by ID
 *     description: Gets the details of a specific offer using its ID.
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the offer to retrieve.
 *         schema:
 *           type: string
 *           example: "offer123"
 *     responses:
 *       200:
 *         description: Offer retrieved successfully
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
 *                   example: "Offer retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "offer123"
 *                     name:
 *                       type: string
 *                       example: "Special Discount"
 *                     discountType:
 *                       type: string
 *                       example: "fixed"
 *                     discountValue:
 *                       type: number
 *                       example: 10
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-10-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-10-31"
 *       404:
 *         description: Offer not found
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
 *                   example: "Offer not found."
 *       500:
 *         description: Failed to retrieve offer due to server error
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
 *                   example: "Failed to retrieve offer."
 *                 error:
 *                   type: string
 */
router.get("/:id", authorization, getOfferById);

/**
 * @swagger
 * /offers/{offerId}/products:
 *   get:
 *     summary: Get products associated with an offer
 *     description: Retrieve a list of products that are associated with a given offer ID, along with their offer-specific price details.
 *     tags:
 *       - Offer
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         description: The ID of the offer to retrieve products for.
 *         schema:
 *           type: string
 *           example: "e3d4f6b7-2c59-45df-bc0c-6a92cd54de1d"
 *     responses:
 *       200:
 *         description: Successfully retrieved the products associated with the offer.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offerId:
 *                   type: string
 *                   description: ID of the offer.
 *                   example: "e3d4f6b7-2c59-45df-bc0c-6a92cd54de1d"
 *                 offerName:
 *                   type: string
 *                   description: Name of the offer.
 *                   example: "Summer Sale"
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         description: ID of the product.
 *                         example: "a12b3c4d-567e-89fg-012h-34i567jklmn8"
 *                       productName:
 *                         type: string
 *                         description: Name of the product.
 *                         example: "Organic Fertilizer"
 *                       productDescription:
 *                         type: string
 *                         description: Description of the product.
 *                         example: "A high-quality organic fertilizer suitable for all crops."
 *                       quantity:
 *                         type: number
 *                         description: Quantity of the product in kilograms.
 *                         example: 50
 *                       price:
 *                         type: number
 *                         description: Original price of the product.
 *                         example: 100
 *                       image:
 *                         type: string
 *                         description: Image URL of the product.
 *                         example: "https://example.com/products/organic-fertilizer.png"
 *                       offerValue:
 *                         type: number
 *                         description: Price after applying the offer discount.
 *                         example: 80
 *       404:
 *         description: Offer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This offer does not exist"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the offer with products"
 */
router.get("/:offerId/products", authorization, getProductsByOfferId);

export default router;