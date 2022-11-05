import { Request } from 'express';
import { Response } from 'express-serve-static-core';

export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,// Если был создан ресурс, то серверу следует вернуть ответ 201 (Created) с указанием URI нового ресурса в заголовке Location.
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 = 401,
    NO_ACCESS_CONTENT_403 = 403,
    NOT_FOUND_404 = 404,
    SERVER_ERROR_500 = 500
}
export type RequestWithParams<P> = Request<P>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQueryBody<Q, B> = Request<{}, {}, B, Q>
export type RequestWithParamsQuery<P, Q> = Request<P, {}, {}, Q>
export type RequestWithParamsBody<P, B> = Request<P, {}, B>
export type RequestWithParamsQueryBody<P, Q, B> = Request<P, {}, B, Q>
export type RequestWithUser<U> = Request & U

export type ResponseWithCode<C extends number> = Response<{}, {}, C>
export type ResponseWithBodyCode<B , C extends number> = Response<B, {}, C>

