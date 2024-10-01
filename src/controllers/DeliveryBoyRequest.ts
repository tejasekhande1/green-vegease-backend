import { Request, Response } from "express";
import db from "../config/database";
import {
    deliveryBoyRequestsTable,
    DeliveryBoyRequestStatusEnum,
} from "../schema/DeliveryBoyRequests";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { InsertUser, insertUser, UserRoleEnum } from "../schema/Auth";

export const acceptOrDeclineDeliveryBoyStatus = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    const { isAccepted } = req.body;
    const { id } = req.params;

    try {
        const [deliveryBoyRequest] = await db
            .select()
            .from(deliveryBoyRequestsTable)
            .where(eq(deliveryBoyRequestsTable.id, id));

        console.log(deliveryBoyRequest);

        if (!deliveryBoyRequest) {
            return res.status(404).json({
                success: false,
                message: "Delivery boy request not found",
            });
        }

        if (isAccepted) {
            await createDeliveryBoyUser(deliveryBoyRequest);

            await updateDeliveryBoyStatus(
                id,
                DeliveryBoyRequestStatusEnum.ACCEPTED,
            );

            return res.status(200).json({
                success: true,
                message:
                    "Delivery boy request accepted and user created successfully",
            });
        } else {
            await updateDeliveryBoyStatus(
                id,
                DeliveryBoyRequestStatusEnum.CANCELED,
            );

            return res.status(200).json({
                success: true,
                message: "Delivery boy request declined successfully",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error processing delivery boy request",
            error: (error as Error).message,
        });
    }
};

const updateDeliveryBoyStatus = async (
    id: string,
    status: DeliveryBoyRequestStatusEnum,
) => {
    return await db
        .update(deliveryBoyRequestsTable)
        .set({ requestStatus: status })
        .where(eq(deliveryBoyRequestsTable.id, id));
};

const createDeliveryBoyUser = async (deliveryBoy: InsertUser) => {
    const hashedPassword = await bcrypt.hash(deliveryBoy.password, 10);

    return await insertUser({
        email: deliveryBoy.email,
        password: hashedPassword,
        username: deliveryBoy.username,
        firstName: deliveryBoy.firstName,
        lastName: deliveryBoy.lastName,
        mobileNumber: deliveryBoy.mobileNumber,
        role: UserRoleEnum.DELIVERY_BOY,
        profilePicture: deliveryBoy.profilePicture,
    });
};
