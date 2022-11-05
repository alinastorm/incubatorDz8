import express from 'express';

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
    server!: http.Server
    port: number | string = process.env.PORT || 9000
    runHttpServer() {
        //body Parser
        this.app.use(express.json())
        //routes
        this.app.use([
            testingRoutes,
            blogsRoutes,
            postsRoutes,
            usersRoutes,
            authRoutes,
            commentsRoutes,

        ])
        //starting server
        this.server = this.app.listen(this.port, () => console.log(`http://localhost:${this.port}`))
    }
    stop() {
        this.server.close()
    }
}

export default new HttpService()