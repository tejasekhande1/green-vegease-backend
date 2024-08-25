import { z } from "zod";

export const AuthRequestSchemas = {
    signUp: z.object({
        firstname: z.string({ 
            required_error: "First name is required.", 
            invalid_type_error: "First name must be a string." 
        }),
        lastname: z.string({ 
            required_error: "Last name is required.", 
            invalid_type_error: "Last name must be a string." 
        }),
        username: z.string({ 
            required_error: "Username is required.", 
            invalid_type_error: "Username must be a string." 
        }),
        mobileNumber: z.string({ 
            required_error: "Mobile number is required.", 
            invalid_type_error: "Mobile number must be a string." 
        }),
        email: z.string({ 
            required_error: "Email is required.", 
            invalid_type_error: "Email must be a string." 
        }).email("Invalid email format."),
        password: z.string({ 
            required_error: "Password is required.", 
            invalid_type_error: "Password must be a string." 
        }).min(8, "Password must be at least 8 characters long."),
        confirmedPassword: z.string({ 
            required_error: "Confirmed password is required.", 
            invalid_type_error: "Confirmed password must be a string." 
        }).min(8, "Confirmed password must be at least 8 characters long."),
    }),
    login: z.object({
        mobileNumber: z.string({required_error:"Mobile Number is required"}),
        password: z.string({required_error:"Password is required"}),
    }),
    sendVerificationEmail: z.object({
        email: z.string().email(),
    }),
};