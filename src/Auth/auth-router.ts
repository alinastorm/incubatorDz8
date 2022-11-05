import express from 'express';


import { mainValidator400 } from '../_common/middlewares/mainValidator-middleware';
import { authJwtBearerMiddleware } from '../_common/middlewares/authJwtBearer-middleware';
import authController from './auth-controller';
import { loginBodyValidationMiddleware } from '../_common/middlewares/login-body-validation-middleware';
import { passwordBodyValidationMiddleware } from '../_common/middlewares/password-body-validation-middleware';
import { emailBodyValidationMiddleware } from '../_common/middlewares/email-validation-middleware';
import { schemaLoginInputValidationMiddleware } from '../_common/middlewares/schemaLoginInput-validation-middleware';
import { codeConfirmBodyValidationMiddleware } from '../_common/middlewares/codeConfirm-body-validation-middleware';



export const authRoutes = express.Router()

authRoutes.post(`/auth/login`,
    // loginBodyValidationMiddleware,
    // passwordBodyValidationMiddleware,
    schemaLoginInputValidationMiddleware,
    mainValidator400,
    authController.login)

authRoutes.post(`/auth/registration-confirmation`,
    codeConfirmBodyValidationMiddleware,
    mainValidator400,
    authController.confirmRegistration
)

authRoutes.post(`/auth/registration`,
    loginBodyValidationMiddleware,
    passwordBodyValidationMiddleware,
    emailBodyValidationMiddleware,
    mainValidator400,
    <any> authController.registration
)
//TODO есть ли удобный способ передать payload между middleware что бы не мутировать req resp?
authRoutes.post(`/auth/registration-email-resending`,
    emailBodyValidationMiddleware,//Email of already registered but not confirmed user
    mainValidator400,
    <any> authController.resendEmail
)

authRoutes.post(`/auth/me`,
    <any> authJwtBearerMiddleware,
    <any> authController.getUser)
