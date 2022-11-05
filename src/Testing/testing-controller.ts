import { Request } from 'express';

import usersRepository from '../Users/users-repository';


import postsRepository from '../Posts/posts-repository';
import blogsRepository from '../Blogs/blogs-repository';
import authRepository from '../Auth/auth-repository';
import { HTTP_STATUSES, ResponseWithCode } from '../_common/services/http-service/types';


class TestingController {

    async deleteAll(req: Request, res: ResponseWithCode<204>) {
        await postsRepository.deleteAll()
        await blogsRepository.deleteAll()
        await usersRepository.deleteAll()
        await authRepository.deleteAll()
        res.status(HTTP_STATUSES.NO_CONTENT_204).send('All data is deleted')
    }


}
export default new TestingController()