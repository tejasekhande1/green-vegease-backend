import express from "express";
import { acceptOrDeclineDeliveryBoyStatus } from "../controllers/DeliveryBoyRequest";
import { RequestSchemas, ValidateZod } from "../validation/utils";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/delivery-boy-requests/{id}:
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
    "/delivery-boy-status/:id",
    ValidateZod(
        RequestSchemas.deliveryBoyRequest.acceptOrDeclineDeliveryBoyRequest,
    ),
    acceptOrDeclineDeliveryBoyStatus,
);

export default router;
