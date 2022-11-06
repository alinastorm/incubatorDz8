import express from 'express';
import cookieParser from 'cookie-parser';
import fs from "node:fs"
import path from "node:path"
import https from "node:https"

import * as core from 'express-serve-static-core';
import * as http from 'http';
import { authRoutes } from '../../../Auth/auth-router';
import { blogsRoutes } from '../../../Blogs/blogs-router';
import { commentsRoutes } from '../../../Comments/comments-router';
import { postsRoutes } from '../../../Posts/posts-router';
import { testingRoutes } from '../../../Testing/testing-router';
import { usersRoutes } from '../../../Users/users-router';


class HttpService {
    app: core.Express = express()
    httpServer!: http.Server
    httpsServer!: https.Server
    httpPort: number | string = process.env.HTTP_PORT || 80
    httpsPort: number | string = process.env.HTTPS_PORT || 443
    runHttpsServer() {
        //middlewares
        this.app.use(express.json())
        this.app.use(cookieParser())
        //routes
        this.app.use([
            testingRoutes,
            blogsRoutes,
            postsRoutes,
            usersRoutes,
            authRoutes,
            commentsRoutes,
        ])
        // Certificate
        const privateKey = fs.readFileSync('./ssl/key.pem', 'utf-8')
        const certificate = fs.readFileSync('./ssl/cert.pem', 'utf-8')
        const ca = fs.readFileSync('./ssl/csr.pem', 'utf8');
        // const server = https.createServer({
        //     key: privateKey,
        //     cert: certificate,
        //     ca: ca
        // }, this.app
        // )
        const credentials = {
            key: privateKey,
            cert: certificate,
            ca: ca //TODO почитать что это так как можно и без него
        }
        // Starting both http & https servers
        const httpServer = http.createServer(this.app);
        const httpsServer = https.createServer(credentials, this.app);

        this.httpServer = httpServer.listen(this.httpPort, () => {
            console.log(`HTTP Server running on port ${this.httpPort}`);
        });

        this.httpsServer = httpsServer.listen(this.httpsPort, () => {
            console.log(`HTTPS Server running on port ${this.httpsPort}`);
        });
        // //starting server
        // server.listen(this.port, () => console.log(`http://localhost:${this.port}`))
        // this.server = this.app.listen(this.port, () => console.log(`http://localhost:${this.port}`))
    }
    stop() {
        this.httpServer.close()
        this.httpsServer.close()
    }
}

export default new HttpService()