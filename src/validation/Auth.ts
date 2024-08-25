import { z } from "zod";

export const AuthRequestSchemas = {
    signUp: z.object({
        firstname: z.string(),
        lastname: z.string(),
        username: z.string(),
        mobileNumber: z.string(),
        email: z.string().email(),
        password: z.string(),
        confirmedPassword: z.string(),
    }),
    login: z.object({
        mobileNumber: z.string({required_error:"Mobile Number is required"}),
        password: z.string({required_error:"Password is required"}),
    }),
    sendVerificationEmail: z.object({
        email: z.string().email(),
    }),
};