import { z } from "zod";

export const DeliveryBoyRequestSchema = {
    acceptOrDeclineDeliveryBoyRequest: z.object({
        isAccepted: z.boolean({
            required_error: "isAccepted is required.",
            invalid_type_error: "isAccepted must be boolean.",
        }),
    }),
};