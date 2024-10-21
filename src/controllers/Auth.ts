import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq, or } from "drizzle-orm";

import db from "../config/database";
import { insertUser } from "../schema/utils";
import { UserRoleEnum, userTable } from "../schema/Auth";
import { insertDeliveryBoyRequest } from "../schema/DeliveryBoyRequests";
import {
    createVerificationSMS,
    createVerificationCheck,
    SMSVerificationStatus,
} from "../library/SMSVerification";
import { IRequestWithLocal } from "../library/types";
import { successResponse } from "./utils";
import { generateProfilePictureUrl } from "../services/Auth";
import { generateAuthToken } from "../library/authorization";

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
        const {
            firstname,
            lastname,
            username,
            mobileNumber,
            email,
            password,
            isRequestedForDeliveryBoy,
        } = req.body;

        const existingUser = await db
            .select({
                email: userTable.email,
                mobileNumber: userTable.mobileNumber,
            })
            .from(userTable)
            .where(
                or(
                    eq(userTable.email, email),
                    eq(userTable.mobileNumber, mobileNumber),
                ),
            );

        if (existingUser.length !== 0) {
            const message =
                existingUser[0].email === email
                    ? "Email address is already registered"
                    : "Mobile number is already registered";

            return res.status(400).json({
                success: false,
                message,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePicture = generateProfilePictureUrl(firstname, lastname);

        if (isRequestedForDeliveryBoy) {
            const deliveryBoy = await insertDeliveryBoyRequest({
                email: email,
                password: hashedPassword,
                username: username,
                firstName: firstname,
                lastName: lastname,
                mobileNumber: mobileNumber,
                profilePicture: profilePicture,
            });

            return res.status(200).json({
                success: true,
                message: "Delivery boy request send successfully",
                user: {
                    first_name: deliveryBoy[0].firstName,
                    last_name: deliveryBoy[0].lastName,
                    email: deliveryBoy[0].email,
                    mobile_number: deliveryBoy[0].mobileNumber,
                    profile_picture: deliveryBoy[0].profilePicture,
                },
            });
        } else {
            const user = await insertUser({
                email: email,
                password: hashedPassword,
                username: username,
                firstName: firstname,
                lastName: lastname,
                mobileNumber: mobileNumber,
                profilePicture: profilePicture,
            });

            (req as IRequestWithLocal).local = {};
            (req as IRequestWithLocal).local.user = user[0];

            next();
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
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
                message: "Username or password is incorrect",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            filteredUsers[0].password,
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Username or password is incorrect",
            });
        }

        const user = {
            id: filteredUsers[0].id,
            email: filteredUsers[0].email,
            username: filteredUsers[0].username,
            firstName: filteredUsers[0].firstName,
            lastName: filteredUsers[0].lastName,
            mobileNumber: filteredUsers[0].mobileNumber,
            role: filteredUsers[0].role as UserRoleEnum | null,
            profilePicture: filteredUsers[0].profilePicture,
        };

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const token = generateAuthToken(payload);

        return successResponse(
            res,
            { token, user },
            200,
            "User logged in successfully",
        );
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while logging in user.",
            error: (error as Error).message,
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { mobileNumber, newPassword, confirmedNewPassword } = req.body;

    try {
        const [user] = await db
            .select({
                id: userTable.id,
            })
            .from(userTable)
            .where(eq(userTable.mobileNumber, mobileNumber))
            .limit(1);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
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
            .where(eq(userTable.id, user.id));
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

export const sendVerificationSMS = async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;

    await createVerificationSMS(mobileNumber);

    return res.status(200).json({
        message: "Verification SMS sent successfully",
    });
};

export const verifySMSCode = async (req: Request, res: Response) => {
    const { mobileNumber, code } = req.body;

    const verificationCheck = await createVerificationCheck(code, mobileNumber);

    if (verificationCheck.status === SMSVerificationStatus.APPROVED) {
        return res.status(200).json({
            message: "Verification successful",
        });
    }

    return res.status(400).json({
        message: "Verification unsuccessful",
    });
};

export const responseWithUser = (
    req: IRequestWithLocal,
    res: Response,
    next: NextFunction,
) => {
    const user = req.local.user;

    if (!user) {
        new Error(
            "responseWithUser expects user to be in the request.local object",
        );
    }

    return successResponse(
        res,
        {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            mobile_number: user.mobileNumber,
            profile_picture: user.profilePicture,
        },
        201,
        "User created successfully",
    );
};
