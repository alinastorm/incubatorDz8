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
        // SSL Certificate
        const privateKey = fs.readFileSync('./ssl/ubt.by-key.pem', 'utf-8')
        const certificate = fs.readFileSync('./ssl/ubt.by-crt.pem', 'utf-8')
        const ca = fs.readFileSync('./ssl/ubt.by-chain-only.pem', 'utf8');      

        const credentials = {
            key: privateKey,
            cert: certificate,
            ca: ca 
        }
        // Starting both http & https servers
        const httpsServer = https.createServer(credentials, this.app);
        const httpServer = http.createServer(this.app);
        
        this.httpsServer = httpsServer.listen(this.httpsPort, () => {
            console.log(`HTTPS Server running on port ${this.httpsPort}`);
        });

        this.httpServer = httpServer.listen(this.httpPort, () => {
            console.log(`HTTP Server running on port ${this.httpPort}`);
        });
   
    }
    stop() {
        this.httpServer.close()
        this.httpsServer.close()
    }
}

export default new HttpService()