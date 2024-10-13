import express from "express";
import { getUsers } from "../controllers/User";
import { authorization } from "../library/authorization";

const router = express.Router();

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users with optional filtering by role
 *     description: Retrieve a list of users. Optionally, filter users by their role by passing a query parameter `userRole`.
 *     operationId: getUsers
 *     parameters:
 *       - in: query
 *         name: userRole
 *         schema:
 *           type: string
 *           enum: [customer, delivery-boy, admin]
 *         description: Filter users by their role.
 *     responses:
 *       200:
 *         description: Successfully fetched users.
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
 *                   example: "Users Fetch successfully."
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
 *       500:
 *         description: An error occurred while fetching the users.
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
 *                   example: "An error occurred while fetching the users."
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authorization, getUsers);

export default router;
