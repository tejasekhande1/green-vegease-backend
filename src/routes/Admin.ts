import express from "express";
import { acceptOrDeclineDeliveryBoyStatus } from "../controllers/DeliveryBoyRequest";
import { RequestSchemas, ValidateZod } from "../validation/utils";
import { getPendingDeliveryBoyRequests } from "../controllers/DeliveryBoyRequest";
import { authorization, isAdmin } from "../library/authorization";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/delivery-boy-requests/{id}/status:
 *   put:
 *     summary: Accept or decline a delivery boy request
 *     description: This endpoint allows an admin to either accept or decline a delivery boy request. If the request is accepted, the delivery boy is registered as a user with the role 'delivery boy'. If declined, the request status is updated to 'canceled'.
 *     tags:
 *       - Delivery Boy
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the delivery boy request to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAccepted:
 *                 type: boolean
 *                 description: Flag indicating whether the request is accepted (`true`) or declined (`false`)
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully processed the delivery boy request
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
 *                   example: Delivery boy request accepted and user created successfully
 *       404:
 *         description: Delivery boy request not found
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
 *                   example: Delivery boy request not found
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
 *                   example: Error processing delivery boy request
 *                 error:
 *                   type: string
 *                   example: Some server error message
 */
router.put(
    "/delivery-boy-requests/:id/status",
    authorization,
    isAdmin,
    ValidateZod(
        RequestSchemas.deliveryBoyRequest.acceptOrDeclineDeliveryBoyRequest,
    ),
    acceptOrDeclineDeliveryBoyStatus,
);

/**
 * @swagger
 * /api/v1/admin/delivery-boy-requests/pending:
 *   get:
 *     tags:
 *       - Delivery Boy
 *     summary: Get pending delivery boy requests
 *     description: Retrieve a list of all pending delivery boy requests.
 *     operationId: getPendingDeliveryBoyRequests
 *     responses:
 *       200:
 *         description: Successfully fetched pending delivery boy requests.
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
 *                   example: "Pending delivery boy request fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       first_name:
 *                         type: string
 *                         example: "John"
 *                       last_name:
 *                         type: string
 *                         example: "Doe"
 *                       mobile_number:
 *                         type: string
 *                         example: "+1234567890"
 *                       profile_picture:
 *                         type: string
 *                         example: "https://example.com/profile.jpg"
 *                       status:
 *                         type: string
 *                         example: "PENDING"
 *       500:
 *         description: Error while fetching delivery boy requests.
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
 *                   example: "Error while fetching delivery boy requests"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get(
    "/delivery-boy-requests/pending",
    authorization,
    isAdmin,
    getPendingDeliveryBoyRequests,
);

export default router;
