import { UserInputModel, UserViewModel } from '../Users/types';
import usersRepository from '../Users/users-repository';
import { APIErrorResult } from '../_common/middlewares/types';
import cryptoService from '../_common/services/crypto-service';
import { RegistrationConfirmationCodeModel, RegistrationEmailResending } from '../_common/services/email-service/types';
import { HTTP_STATUSES, RequestWithBody, RequestWithCookies, ResponseWithBodyCode, ResponseWithCode } from '../_common/services/http-service/types';
import { jwtService } from '../_common/services/jwt-service';
import registrationCode from './registrationCode-repository';
import authRepository from './auth-repository';
import { RegistrationCodeViewModel, AuthViewModel, LoginInputModel, LoginSuccessViewModel, MeViewModel, AccessTokenPayloadModel, RottenToken } from './types';
import emailService from "../_common/services/email-service/gmail-adapter"
import { v4 as uuidv4 } from 'uuid'
import add from 'date-fns/add'
import tokensRepository from './tokens-repository';

class AuthController {
    /**In cookie client must send correct refreshToken that will be revoked
     * Задача бека, отметить refreshToken как невалидный (токен приходит в cookie)
     */
    async logout(
        req: RequestWithCookies<{ refreshToken: string }>,
        res:
            ResponseWithCode<204> &
            ResponseWithBodyCode<APIErrorResult, 401>
    ) {
        const reqRefreshToken = req.cookies.refreshToken
        if (!reqRefreshToken) return res.sendStatus(401)
        //проверяем тухлый ли токен
        const userId = jwtService.getDataByRefreshToken(reqRefreshToken)?.userId
        if (!userId) return res.sendStatus(401)
        //проверяем в невалидных 
        const query: Omit<RottenToken, "expirationDate" | 'id'> = { refreshToken: reqRefreshToken }
        const refreshBdTokens = await tokensRepository.readAll(query)
        if (refreshBdTokens.length) return res.sendStatus(401)
        //добавляем в невалидные
        const seconds = process.env.JWT_REFRESH_LIFE_TIME_SECONDS ?? 20
        const expirationDate = add(new Date(), { seconds: Number(seconds) })
        const element: Omit<RottenToken, 'id'> = { refreshToken: reqRefreshToken, expirationDate }
        await tokensRepository.createOne(element)

        res.status(HTTP_STATUSES.NO_CONTENT_204)
    }
    /**Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)
     * Клиент отправляет на бек refreshToken в cookie, мы должны вернуть новую пару токенов (старый refreshToken протухает, т.е. отмечаем refreshToken как невалидный)
     */
    async refreshTokens(
        req: RequestWithCookies<{ refreshToken: string }>,
        res:
            ResponseWithBodyCode<{ accessToken: string }, 200> &
            RequestWithCookies<{ refreshToken: string }> &
            ResponseWithBodyCode<APIErrorResult, 401>
    ) {
        const reqRefreshToken = req.cookies.refreshToken
        if (!reqRefreshToken) return res.sendStatus(401)
        //проверяем тухлый ли токен
        const userId = jwtService.getDataByRefreshToken(reqRefreshToken)?.userId
        if (!userId) return res.sendStatus(401)
        //проверяем в невалидных 
        const query: Omit<RottenToken, "expirationDate" | 'id'> = { refreshToken: reqRefreshToken }
        const refreshBdTokens = await tokensRepository.readAll(query)
        if (refreshBdTokens.length) return res.sendStatus(401)
        //добавляем в невалидные
        const seconds = process.env.JWT_REFRESH_LIFE_TIME_SECONDS ?? 20
        const expirationDate = add(new Date(), { seconds: Number(seconds) })
        const element: Omit<RottenToken, 'id'> = { refreshToken: reqRefreshToken, expirationDate }
        await tokensRepository.createOne(element)

        const newRefreshToken = jwtService.generateRefreshToken({ userId })
        const newAccessToken = jwtService.generateAccessToken({ userId })
        res.cookie("refreshToken", newRefreshToken, { maxAge: Number(seconds) * 1000, httpOnly: true, secure: true })// maxAge: 10 milliseconds
        res.status(HTTP_STATUSES.OK_200).json(newAccessToken)
    }
    /** Try login user to the system*/
    async login(
        req: RequestWithBody<LoginInputModel>,
        res:
            ResponseWithBodyCode<{ accessToken: string }, 200> &
            RequestWithCookies<{ refreshToken: string }> &
            ResponseWithBodyCode<APIErrorResult, 401>
    ) {
        const { login, password } = req.body
        // user
        const users = await usersRepository.readAll<UserViewModel>({ login })
        if (!users.length) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        // if (users[0].confirm !== true) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        // auth
        const userId = users[0].id
        const auths = await authRepository.readAll<AuthViewModel>({ userId })
        if (!auths.length) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        // hash
        const passwordHash = auths[0].passwordHash
        const isEqual = await cryptoService.checkPasswordByHash(passwordHash, password)
        if (!isEqual) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        //Token

        const accessToken: LoginSuccessViewModel = jwtService.generateAccessToken({ userId })
        const refreshToken: string = jwtService.generateRefreshToken({ userId })

        res.cookie("refreshToken", refreshToken, { maxAge: 10 * 1000, httpOnly: true, secure: true })// maxAge: 10 milliseconds
        res.status(HTTP_STATUSES.OK_200).send(accessToken)
    }
    async confirmRegistration(
        req: RequestWithBody<RegistrationConfirmationCodeModel>,
        res: ResponseWithCode<204> & ResponseWithBodyCode<APIErrorResult, 400>
    ) {

        const code = req.body.code
        const codes = await registrationCode.readAll<RegistrationCodeViewModel>({ code })

        if (!codes.length) {
            const result: APIErrorResult = { errorsMessages: [{ message: "code not found", field: "code" }] }
            return res.status(400).json(result)
        }
        if (codes[0].expirationDate < new Date()) {
            const result: APIErrorResult = { errorsMessages: [{ message: "code expired", field: "code" }] }
            return res.status(400).json(result)
        }

        const userId = codes[0].userId
        await usersRepository.updateOne<UserViewModel>(userId, { confirm: true })

        const codesUser = await registrationCode.readAll<RegistrationCodeViewModel>({ userId })
        await Promise.all(codesUser.map(async ({ id }) => {
            await registrationCode.deleteOne<RegistrationCodeViewModel>(id)
        }))

        res.sendStatus(204)
    }
    async registration(
        req: RequestWithBody<UserInputModel>,
        res: ResponseWithCode<204> & ResponseWithBodyCode<APIErrorResult, 400>
    ) {

        const { email, login, password } = req.body

        const filterLogin: Partial<UserViewModel> = { login }
        const usersByLogin: UserViewModel[] = await usersRepository.readAll<UserViewModel>(filterLogin)
        if (usersByLogin.length) {
            const result: APIErrorResult = { errorsMessages: [{ message: "login exist", field: "login" }] }
            return res.status(400).json(result)
        }
        const filterEmail: Partial<UserViewModel> = { email }
        const usersByEmails: UserViewModel[] = await usersRepository.readAll<UserViewModel>(filterEmail)
        if (usersByEmails.length) {
            const result: APIErrorResult = { errorsMessages: [{ message: "email exist", field: "email" }] }
            return res.status(400).json(result)
        }

        const createdAt = new Date().toISOString()
        const queryUser: Omit<UserViewModel, 'id'> = { email, login, createdAt, confirm: false }
        const userId: string = await usersRepository.createOne(queryUser)

        const passwordHash = await cryptoService.generatePasswordHash(password)
        const queryAuth: Omit<AuthViewModel, "id"> = { passwordHash, userId, createdAt }
        const idAuth: string = await authRepository.createOne(queryAuth)

        const subject = "activation code"
        const code = uuidv4()
        const link = `${process.env.API_URL}/auth/registration-confirmation?code=${code}`
        const message =
            `
            <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
               <a href='${link}'>complete registration</a>
           </p>
        `
        try {
            emailService.sendEmail(email, subject, message)
        } catch (error) {
            await usersRepository.deleteOne(userId)
            await authRepository.deleteOne(idAuth)
            const result: APIErrorResult = { errorsMessages: [{ message: "send mail error", field: "email" }] }
            return res.status(400).json(result)
        }

        const expirationDate = add(new Date(), {
            hours: 1,
            minutes: 3
        })
        const restartTime = add(new Date(), {
            minutes: 2
        })
        const element: Omit<RegistrationCodeViewModel, 'id'> = { email, code, expirationDate, userId, restartTime }
        await registrationCode.createOne<RegistrationCodeViewModel>(element)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }
    async resendEmail(
        req: RequestWithBody<RegistrationEmailResending>,
        res: ResponseWithCode<204> & ResponseWithBodyCode<APIErrorResult, 400>
    ) {
        const email = req.body.email
        const filterEmail: Partial<RegistrationCodeViewModel> = { email }
        const codes = await registrationCode.readAll<RegistrationCodeViewModel>(filterEmail)
        if (!codes.length) {
            const result: APIErrorResult = { errorsMessages: [{ message: "email not found", field: "email" }] }
            return res.status(400).json(result)
        }
        if (codes[0].restartTime < new Date()) {
            const result: APIErrorResult = { errorsMessages: [{ message: "wait 2 minutes", field: "email" }] }
            return res.status(400).json(result)
        }

        const subject = "activation code"
        const code = uuidv4()
        const link = `${process.env.API_URL}/confirm-email?code=${code}`
        const message =
            `
            <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
               <a href='${link}'>complete registration</a>
           </p>
        `
        try {
            emailService.sendEmail(email, subject, message)
        } catch (error) {
            const result: APIErrorResult = { errorsMessages: [{ message: "send mail error", field: "email" }] }
            return res.status(400).json(result)
        }

        const expirationDate = add(new Date(), {
            hours: 1,
            minutes: 3
        })
        const restartTime = add(new Date(), {
            minutes: 0
        })
        const element: Omit<RegistrationCodeViewModel, 'id'> = { email, code, expirationDate, userId: codes[0].userId, restartTime }
        await registrationCode.createOne<RegistrationCodeViewModel>(element)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async getUser(
        req: RequestWithCookies<{ accessToken: string }>,
        res: ResponseWithBodyCode<MeViewModel, 200 | 401 | 500>
    ) {
        const reqAccessToken = req.cookies.accessToken
        //проверяем тухлый/валидный ли токен
        const userId = jwtService.getDataByAccessToken(reqAccessToken)?.userId
        if (!userId) return res.sendStatus(401)
        //проверяем в невалидных 
        const filter: Omit<RottenToken, "expirationDate" | 'id'> = { refreshToken: reqAccessToken }
        const rootenRefreshBdTokens = await tokensRepository.readAll(filter)
        if (rootenRefreshBdTokens.length) return res.sendStatus(401)

        const user: UserViewModel | null = await usersRepository.readOne(userId)
        if (!user) return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        const result: MeViewModel = {
            email: user.email,
            login: user.login,
            userId: user.id
        }
        res.status(HTTP_STATUSES.OK_200).send(result)
    }
}
export default new AuthController()