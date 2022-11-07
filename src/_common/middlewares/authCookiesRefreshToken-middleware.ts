import { NextFunction, Response } from 'express';
import tokensRepository from '../../Auth/tokens-repository';
import { RottenToken } from '../../Auth/types';
import { HTTP_STATUSES, RequestWithCookies } from '../services/http-service/types';
import { jwtService } from '../services/jwt-service';


export const authCookiesRefreshTokenMiddleware = async (
    req: RequestWithCookies<{ refreshToken: string }> & { userId?: string },
    res: Response, next: NextFunction
) => {
    //достаем refreshToken
    const reqRefreshToken = req.cookies.refreshToken
    //Проверка наличия cookies авторизации
    if (!reqRefreshToken) {
        // console.log('нет reqRefreshToken');

        return res.sendStatus(401)
    }
    //проверяем валидность и тухлость
    const userId = jwtService.getDataByRefreshToken(reqRefreshToken)?.userId

    if (!userId) {
        // console.log('тухлый не валидный');

        return res.sendStatus(401)
    }
    //проверяем в списаных
    const query: Omit<RottenToken, "expirationDate" | 'id'> = { refreshToken: reqRefreshToken }
    const refreshBdTokens = await tokensRepository.readAll(query)
    if (refreshBdTokens.length) {
        // console.log('списанные');

        return res.sendStatus(401)
    }
    //Мутируем req
    req.userId = userId //TODO глаза мне мозолит этот userId в req

    next()
}
