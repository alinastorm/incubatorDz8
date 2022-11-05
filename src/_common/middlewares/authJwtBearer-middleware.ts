import { NextFunction, Response } from 'express';
import { HTTP_STATUSES } from '../services/http-service/types';
import { jwtService } from '../services/jwt-service';


export const authJwtBearerMiddleware = async (
    req: Request & { headers: { authorization: string } } & { userId: string },
    res: Response, next: NextFunction
) => {

    if (!req.headers.authorization) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }

    const [type, token] = req.headers.authorization.split(' ')
    if (type !== "Bearer" || !token) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    const userId: string = jwtService.getUserIdByToken(token)

    // const user: UserViewModel = await usersRepository.readOne(userId)
    if (!userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

    req.userId = userId
    next()
}
