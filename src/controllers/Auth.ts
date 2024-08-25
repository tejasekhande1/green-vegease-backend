import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { and, eq } from "drizzle-orm";

import db from "../config/database";
import { insertUser, userTable } from "../schema/Auth";
import {
    generateVerificationToken,
    sendEmail,
} from "../library/EmailVerification";
import { config } from "../config/config";
import Logging from "../library/Logging";
import { AuthRequestSchemas } from "../validation/Auth";
import { z, ZodError } from "zod";

export const signUp = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const {
            firstname,
            lastname,
            username,
            mobileNumber,
            email,
            password,
            confirmedPassword,
        } = req.body;

        if (password !== confirmedPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match, please try again",
            });
        }

        const existingUser = await db
            .select({
                email: userTable.email,
                mobileNumber: userTable.mobileNumber,
            })
            .from(userTable)
            .where(
                and(
                    eq(userTable.email, email),
                    eq(userTable.mobileNumber, mobileNumber),
                ),
            );

        if (existingUser.length !== 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await insertUser({
            email: email,
            password: hashedPassword,
            username: username,
            firstName: firstname,
            lastName: lastname,
            mobileNumber: mobileNumber,
            profilePicture: `https://api.dicebear.com/7.x/initials/svg?seed=${firstname} ${lastname}`,
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: {
                first_name: user[0].firstName,
                last_name: user[0].lastName,
                email: user[0].email,
                mobile_number: user[0].mobileNumber,
                profile_picture: user[0].profilePicture,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while registering user",
            error: (error as Error).message,
        });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { mobileNumber, password } = req.body;

        const filteredUsers = await db
            .select({
                id: userTable.id,
                email: userTable.email,
                password: userTable.password,
                username: userTable.username,
                firstName: userTable.firstName,
                lastName: userTable.lastName,
                mobileNumber: userTable.mobileNumber,
                role: userTable.role,
                profilePicture: userTable.profilePicture,
            })
            .from(userTable)
            .where(eq(userTable.mobileNumber, mobileNumber))
            .limit(1);

        if (filteredUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            filteredUsers[0].password,
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password.",
            });
        }

        const payload = {
            id: filteredUsers[0].id,
            email: filteredUsers[0].email,
            role: filteredUsers[0].role,
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
            expiresIn: "2h",
        });

        const userResponse = {
            ...filteredUsers[0],
            password: undefined,
            token,
        };

        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        return res.cookie("token", token, cookieOptions).status(200).json({
            success: true,
            token,
            user: userResponse,
            message: "User logged in successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while logging in user.",
            error: (error as Error).message,
        });
    }
};

export const sendVerificationEmail = async (req: Request, res: Response) => {
    const { sender, verificationTemplateId: templateId } = config.sendgrid;

    if (!sender || !templateId) {
        return res.status(500).json({
            message: "Email not sent",
            error: "Email sender or template ID not found",
        });
    }

    const { email: recipient } = req.body;
    const token = generateVerificationToken();
    const dynamicData = {
        token: token,
        validity_minutes: 5,
    };
    const mailOptions = {
        to: recipient,
        from: process.env.SENDGRID_SENDER_EMAIL as string,
        templateId: process.env
            .SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID as string,
        dynamic_template_data: dynamicData,
    };

    try {
        Logging.info(`Sending verification email to ${recipient}`);
        await sendEmail(mailOptions);
        Logging.info(`Verification email sent to ${recipient}`);
    } catch (error) {
        return res.status(500).json({
            message: "Email not sent",
            error: "Problem at third party email service",
        });
    }

    return res.status(200).json({
        message: "Email sent successfully",
        receiver_email: recipient,
        sender_email: process.env.SENDGRID_SENDER_EMAIL,
    });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, oldPassword, newPassword, confirmedNewPassword } = req.body;

    try {
        const [user] = await db
            .select({
                email: userTable.email,
                password: userTable.password,
            })
            .from(userTable)
            .where(eq(userTable.email, email))
            .limit(1);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isOldPasswordMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Please enter correct old password.",
            });
        }

        if (newPassword !== confirmedNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirmed password do not match.",
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await db
            .update(userTable)
            .set({ password: hashedNewPassword })
            .where(eq(userTable.email, email));
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while resetting the password.",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Password reset successfully.",
    });
};
