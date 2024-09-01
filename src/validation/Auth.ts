import { z } from "zod";

export const AuthRequestSchemas = {
    signUp: z.object({
        firstname: z.string({
            required_error: "firstName is required.",
            invalid_type_error: "firstName must be a string.",
        }),
        lastname: z.string({
            required_error: "lastName is required.",
            invalid_type_error: "lastName must be a string.",
        }),
        username: z.string({
            required_error: "username is required.",
            invalid_type_error: "username must be a string.",
        }),
        mobileNumber: z.string({
            required_error: "mobileNumber is required.",
            invalid_type_error: "mobileNumber must be a string.",
        }),
        email: z.string({
            required_error: "email is required.",
            invalid_type_error: "email must be a string.",
        }),
        password: z.string({
            required_error: "password is required.",
            invalid_type_error: "password must be a string.",
        }),
        confirmedPassword: z.string({
            required_error: "confirmedPassword is required.",
            invalid_type_error: "confirmedPassword must be a string.",
        }),
    }),
    login: z.object({
        mobileNumber: z.string({ required_error: "mobileNumber is required" }),
        password: z.string({ required_error: "password is required" }),
    }),
    resetPassword: z.object({
        email: z
            .string({
                required_error: "email is required.",
                invalid_type_error: "email must be a string.",
            })
            .email("Invalid email format."),
        oldPassword: z.string({
            required_error: "oldPassword is required.",
            invalid_type_error: "oldPassword must be a string.",
        }),
        newPassword: z.string({
            required_error: "newPassword is required.",
            invalid_type_error: "newPassword must be a string.",
        }),
        confirmedNewPassword: z.string({
            required_error: "confirmedNewPassword is required.",
            invalid_type_error: "confirmedNewPassword must be a string.",
        }),
    }),
    sendVerificationSMS: z.object({
        mobileNumber: z
            .string({
                required_error: "mobileNumber is required.",
                invalid_type_error: "mobileNumber must be a string.",
            })
            .regex(/^\+91[0-9]{10}$/, {
                message: "Invalid mobile number format.",
            }), // Only allow indian mobile number
    }),
    verifySMSCode: z.object({
        code: z
            .string({
                required_error: "code is required.",
                invalid_type_error: "code must be a string.",
            })
            .length(6, { message: "Code must be 6 characters long." }),
    }),
};
