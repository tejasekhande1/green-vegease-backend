import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { and, eq } from "drizzle-orm";

import db from "../config/database";
import { userTable } from "@/schema/user";

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { firstname, lastname, username, mobileNumber, email, password, confirmedPassword } = req.body;

        if (!firstname || !lastname || !username || !mobileNumber || !email || !password || !confirmedPassword) {
            return res.status(400).json({
                success: false, message: "All fields are required",
            });
        }

        if (password !== confirmedPassword) {
            return res.status(400).json({
                success: false, message: "Passwords do not match, please try again",
            });
        }

        const existingUser = await db
            .select({
                email: userTable.email,
                mobileNumber: userTable.mobileNumber,
            })
            .from(userTable)
            .where(and(eq(userTable.email, email), eq(userTable.mobileNumber, mobileNumber)));

        if (existingUser) {
            return res.status(400).json({
                success: false, message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db
            .insert(userTable)
            .values({
                email: email,
                password: hashedPassword,
                username: username,
                firstName: firstname,
                lastName: lastname,
                mobileNumber: mobileNumber,
                profilePicture: `https://api.dicebear.com/7.x/initials/svg?seed=${firstname} ${lastname}`,
            });

        return res.status(201).json({
            success: true, message: "User registered successfully", user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile_number: user.mobile_number,
                profile_picture: user.profile_picture,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: "Error while registering user", error: (error as Error).message,
        });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { mobileNumber, password } = req.body;

        if (!mobileNumber || !password) {
            return res.status(400).json({
                success: false,
                message: "Both mobile number and password are required.",
            });
        }

        const user = await db
            .select({
                email: userTable.email,
                username: userTable.username,
                firstName: userTable.firstName,
                lastName: userTable.lastName,
                mobileNumber: userTable.mobileNumber,
                role: userTable.role,
                profilePicture: userTable.profilePicture,
            })
            .from(userTable)
            .where(eq(userTable.mobileNumber, mobileNumber));

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password.",
            });
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
            expiresIn: "2h",
        });

        const userResponse = { ...user, password: undefined, token };

        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        return res
            .cookie("token", token, cookieOptions)
            .status(200)
            .json({
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
