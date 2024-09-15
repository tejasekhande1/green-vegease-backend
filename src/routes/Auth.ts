import express from "express";
import {
    signUp,
    login,
    resetPassword,
    sendVerificationSMS,
    verifySMSCode,
} from "../controllers/Auth";
import { RequestSchemas, ValidateZod } from "../validation/utils";

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     summary: User signup
 *     description: Create a new user account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               username:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmedPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/signup", ValidateZod(RequestSchemas.auth.signUp), signUp);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *               - password
 *             properties:
 *               mobileNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/login", ValidateZod(RequestSchemas.auth.login), login);

/**
 * @openapi
 * /api/v1/auth/reset-password:
 *   patch:
 *     summary: Reset user password
 *     description: Allows a user to reset their password by providing the old password and a new password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - oldPassword
 *               - newPassword
 *               - confirmedNewPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               oldPassword:
 *                 type: string
 *                 description: The user's current password
 *               newPassword:
 *                 type: string
 *                 description: The new password the user wants to set
 *               confirmedNewPassword:
 *                 type: string
 *                 description: Confirmation of the new password
 *     responses:
 *       200:
 *         description: Password reset successful
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
 *                   example: "Password reset successfully."
 *       400:
 *         description: Bad request - New password and confirmed password do not match
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
 *                   example: "New password and confirmed password do not match."
 *       401:
 *         description: Unauthorized - Incorrect old password
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
 *                   example: "Please enter correct old password."
 *       404:
 *         description: Not Found - User not found
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
 *                   example: "User not found."
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
 *                   example: "An error occurred while resetting the password."
 */
router.patch(
    "/reset-password",
    ValidateZod(RequestSchemas.auth.resetPassword),
    resetPassword,
);

/**
 * @openapi
 * /send-verification-sms:
 *   post:
 *     summary: Send verification SMS
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 pattern: '^\+91[0-9]{10}$'
 *                 description: Indian mobile number with country code
 *     responses:
 *       '200':
 *         description: Verification SMS sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification SMS sent successfully
 *       '400':
 *         description: Bad request (invalid input)
 */
router.post(
    "/send-verification-sms",
    ValidateZod(RequestSchemas.auth.sendVerificationSMS),
    sendVerificationSMS,
);

/**
 * @openapi
 * /verify-sms-code:
 *   post:
 *     summary: Verify SMS code
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - mobileNumber
 *             properties:
 *               code:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 description: 6-digit verification code
 *               mobileNumber:
 *                 type: string
 *                 pattern: '^\+91[0-9]{10}$'
 *                 description: Indian mobile number with country code
 *     responses:
 *       '200':
 *         description: Verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification successful
 *       '400':
 *         description: Verification unsuccessful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification unsuccessful
 */
router.post(
    "/verify-sms-code",
    ValidateZod(RequestSchemas.auth.verifySMSCode),
    verifySMSCode,
);

export default router;
