import { NextFunction, Response } from 'express';
import { RottenToken } from '../../Auth/types';
import { HTTP_STATUSES, RequestWithHeaders } from '../services/http-service/types';
import { jwtService } from '../services/jwt-service';


export const authHeadersJwtMiddleware = async (
    req: RequestWithHeaders<{ authorization: string }> & { userId?: string },
    res: Response, next: NextFunction
) => {

    //Проверка заголовка авторизации
    if (!req.headers.authorization) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
    //Проверка на bearer
    const [type, accessToken] = req.headers.authorization.split(' ')
    if (type !== "Bearer" || !accessToken) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

    // //проверяем в невалидных нет
    // const filter: Omit<RottenToken, "expirationDate" | 'id'> = { refreshToken: accessToken }
    // const rootenRefreshBdTokens = await tokensRepository.readAll(filter)
    // if (rootenRefreshBdTokens.length) return res.sendStatus(401)

    //Достаем userId из токена
    const userId = jwtService.getDataByAccessToken(accessToken)?.userId
    if (!userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

    //Мутируем req
    req.userId = userId //TODO глаза мне мозолит этот userId в req
    next()
}
