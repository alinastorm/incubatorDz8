import express from 'express';

import { authorizationBasicMiddleware401 } from '../_common/middlewares/authBasic-validation-middleware';
import { mainValidator400 } from '../_common/middlewares/mainValidator-middleware';
import { searchLoginTermQueryValidationMiddleware } from '../_common/middlewares/searchLoginTerm-query-validation-middleware';
import { searchEmailTermQueryValidationMiddleware } from '../_common/middlewares/searchEmailTerm-query-validation-middleware';
import { sortDirectionQueryValidationMiddleware } from '../_common/middlewares/sortDirection-validation-middleware';
import { pageSizeQueryValidationMiddleware } from '../_common/middlewares/pageSize-validation-middleware';
import { pageNumberQueryValidationMiddleware } from '../_common/middlewares/pageNumber-validation-middleware';
import { sortByUsersQueryValidationMiddleware } from '../_common/middlewares/sortByUsers-validation-middleware';
import { loginBodyValidationMiddleware } from '../_common/middlewares/login-body-validation-middleware';
import { passwordBodyValidationMiddleware } from '../_common/middlewares/password-body-validation-middleware';
import { emailBodyValidationMiddleware } from '../_common/middlewares/email-validation-middleware';
import { userIdParamUriValidationMiddleware } from '../_common/middlewares/userId-param-validation-middleware';
import usersController from './users-controller';


export const usersRoutes = express.Router()


usersRoutes.get(`/users`,
    searchLoginTermQueryValidationMiddleware,
    searchEmailTermQueryValidationMiddleware,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByUsersQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    mainValidator400,
    <any>usersController.readAllPagination)

usersRoutes.post(`/users`,
    authorizationBasicMiddleware401,
    loginBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    emailBodyValidationMiddleware,
    mainValidator400,
    usersController.createOne)

usersRoutes.delete(`/users/:userId`,
    authorizationBasicMiddleware401,
    userIdParamUriValidationMiddleware,
    mainValidator400,
    usersController.deleteOne)