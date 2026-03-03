import { z } from "zod";

export const AuthSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});


export const validateAuth = (email: string, password: string) => {
    const result = AuthSchema.safeParse({email, password});

    if (!result.success) {
        return {
            isValid: false,
            errorMessage: result.error.issues[0].message
        };
    }

    return {
        isValid: true,
        errorMessage: null
    };
};