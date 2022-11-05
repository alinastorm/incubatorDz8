
export interface AuthViewModel {
    id: string
    userId: string
    /**  maxLength: 20 minLength: 6 */
    passwordHash: string
    createdAt: string
}

export interface AuthInputModel {
    userId: string
    /**  maxLength: 20 minLength: 6 */
    passwordHash: string
}

export interface MeViewModel {
    email: string
    login: string
    userId: string
}

export interface LoginSuccessViewModel {
    /** JWT access token */
    accessToken: string
}

export interface LoginInputModel {
    login: string
    password: string
}
export interface RegistrationCodeViewModel {
    id: string
    userId: string
    email:string
    code: string
    expirationDate: Date
    restartTime:Date
}