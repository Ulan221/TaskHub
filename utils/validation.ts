

export const validateAuth = (email: string, password: string) => {
    if (!email.includes('@')) {
        return {
            isValid: false,
            errorMessage: "Please enter a valid email"
        };
    }
    if (password.length < 6) {
        return {
            isValid: false,
            errorMessage: "Please enter at least 6 characters"
        };
    }
    return {
        isValid: true,
        errorMessage: null
    };
};