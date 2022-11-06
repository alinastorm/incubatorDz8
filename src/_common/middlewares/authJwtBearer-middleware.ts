import { NextFunction, Response } from 'express';
import { HTTP_STATUSES } from '../services/http-service/types';
import { jwtService } from '../services/jwt-service';

//TODO глаза мне мозолит этот userId в req
export const authJwtBearerMiddleware = async (
    req: Request & { headers: { authorization: string } } & { userId?: string },
    res: Response, next: NextFunction
) => {

    if (!req.headers.authorization) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }

    const [type, accessToken] = req.headers.authorization.split(' ')
    if (type !== "Bearer" || !accessToken) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const userId = jwtService.getDataByAccessToken(accessToken)?.userId

    // const user: UserViewModel = await usersRepository.readOne(userId)
    if (!userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

    req.userId = userId
    next()
}
