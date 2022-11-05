import { NextFunction, Request, Response } from 'express';


export const authorizationBasicMiddleware401 = (req: Request, res: Response, next: NextFunction) => {

    const auth = { login: 'admin', password: 'qwerty' }
    const isBasicAuthorization = req.headers.authorization?.split(' ')[0] === "Basic"
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    // Verify login and password 
    if (isBasicAuthorization && login && password && login === auth.login && password === auth.password) {

        // Access 
        return next()
    }
    res.status(401).send('Unauthorized')
}
