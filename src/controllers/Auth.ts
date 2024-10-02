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
import { date } from "drizzle-orm/mysql-core";

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
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message,
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

    (req as IRequestWithLocal).local = {};
    (req as IRequestWithLocal).local.user = user[0];

    next();
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

        const isOldPasswordMatched = await bcrypt.compare(
            oldPassword,
            user.password,
        );
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
