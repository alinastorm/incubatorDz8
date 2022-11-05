import jwt from "jsonwebtoken"
import { LoginSuccessViewModel } from "../../Auth/types";

const secret = process.env.JWT_SECRET || 'test'
export const jwtService = {

    generateAccessToken(userId: string) {
        const accessToken = jwt.sign({ userId }, secret, { expiresIn: '1h' })
        const result: LoginSuccessViewModel = { accessToken }
        return result
    },
    getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, secret)
            //TODO проверка на expiresIn Tokena
            return result.userId
        } catch (error) {
            return null
        }

    }

}
