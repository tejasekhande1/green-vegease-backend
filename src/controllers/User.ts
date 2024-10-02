import { Request, Response } from "express";
import { userTable } from "../schema/Auth";
import db from "../config/database";
import { UserRoleEnum } from "../schema/Auth";
import { eq } from "drizzle-orm";

export const getUsers = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { userRole } = req.query;

    try {
        const baseQuery = db
            .select({
                id: userTable.id,
                first_name: userTable.firstName,
                last_name: userTable.lastName,
                mobile_number: userTable.mobileNumber,
                profile_picture: userTable.profilePicture,
            })
            .from(userTable);

        let userQuery;
        if (userRole) {
            userQuery = baseQuery.where(
                eq(userTable.role, userRole as UserRoleEnum),
            );
        } else {
            userQuery = baseQuery;
        }

        const users = await userQuery;

        return res.status(200).json({
            success: true,
            message: "Users Fetch successfully.",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the users.",
        });
    }
};
