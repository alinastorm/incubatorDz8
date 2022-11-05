import express from 'express';

import { mainValidator400 } from '../_common/middlewares/mainValidator-middleware';
import { commentIdUriParamValidationMiddleware } from '../_common/middlewares/commentID-param-validation-middleware';
import { commentsInputModelSchemaValidationMiddleware } from '../_common/middlewares/commentsInputSchema-validation-middleware';
import { authJwtBearerMiddleware } from '../_common/middlewares/authJwtBearer-middleware';
import commentsController from './comments-controller';


export const commentsRoutes = express.Router()


commentsRoutes.put(`/comments/:commentId`,
    <any>authJwtBearerMiddleware,
    commentIdUriParamValidationMiddleware,
    commentsInputModelSchemaValidationMiddleware,
    mainValidator400,
    <any>commentsController.updateOne)

commentsRoutes.delete(`/comments/:commentId`,
    <any>authJwtBearerMiddleware,
    commentIdUriParamValidationMiddleware,
    mainValidator400,
    <any>commentsController.deleteOne)

commentsRoutes.get(`/comments/:commentId`,
    commentIdUriParamValidationMiddleware,
    mainValidator400,
    commentsController.readOne)

///testing
commentsRoutes.get(`/comments`,
    <any>commentsController.readAll)