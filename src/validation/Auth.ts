import { z } from "zod";

export const AuthRequestSchemas = {
    signUp: z.object({
        firstname: z.string({
            required_error: "firstName is required.",
            invalid_type_error: "firstName must be a string."
        }),
        lastname: z.string({
            required_error: "lastName is required.",
            invalid_type_error: "lastName must be a string."
        }),
        username: z.string({
            required_error: "username is required.",
            invalid_type_error: "username must be a string."
        }),
        mobileNumber: z.string({
            required_error: "mobileNumber is required.",
            invalid_type_error: "mobileNumber must be a string."
        }),
        email: z.string({
            required_error: "email is required.",
            invalid_type_error: "email must be a string."
        }),
        password: z.string({
            required_error: "password is required.",
            invalid_type_error: "password must be a string."
        }),
        confirmedPassword: z.string({
            required_error: "confirmedPassword is required.",
            invalid_type_error: "confirmedPassword must be a string."
        }),
    }),
    login: z.object({
        mobileNumber: z.string({ required_error: "mobileNumber is required" }),
        password: z.string({ required_error: "password is required" }),
    }),
    sendVerificationEmail: z.object({
        email: z.string({
            required_error: "email is required.",
            invalid_type_error: "email must be a string."
        }).email("Invalid email format.")
    }),
};