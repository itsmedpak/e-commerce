export const PASSWORD_MIN_LENGTH = 8

export const getPasswordRules = (password: string) => {
    return {
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[^A-Za-z0-9\s]/.test(password),        
        hasMinLength: password.length >= PASSWORD_MIN_LENGTH,
    }
}

export const isStrongPassword = (password: string) => {
    const rules = getPasswordRules(password)
    return Object.values(rules).every(Boolean)
}