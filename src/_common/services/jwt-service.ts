import jwt from "jsonwebtoken"
import { AccessTokenPayloadModel, LoginSuccessViewModel, RefreshTokenPayloadModel } from "../../Auth/types";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'JWT_ACCESS_SECRET'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET'
export const jwtService = {

    generateAccessToken(payload: AccessTokenPayloadModel) {
        const seconds = process.env.JWT_ACCESS_LIFE_TIME_SECONDS ?? 10
        // console.log('******ACCESS expiresIn:', `${seconds}s`);

        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: `${seconds}s` })
        const result: LoginSuccessViewModel = { accessToken }
        return result
    },
    generateRefreshToken(payload: RefreshTokenPayloadModel) {
        const seconds = process.env.JWT_REFRESH_LIFE_TIME_SECONDS ?? 20
        // console.log('******REFRESH expiresIn:', `${seconds}s`);
        
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: `${seconds}s` })
        return refreshToken
    },
    getDataByAccessToken(token: string) {
        try {
            const result = jwt.verify(token, JWT_ACCESS_SECRET)
            return result as AccessTokenPayloadModel
        } catch (error) {
            return null
        }
    },
    getDataByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_REFRESH_SECRET)
            return result as RefreshTokenPayloadModel
        } catch (error) {
            return null
        }
    }


}
