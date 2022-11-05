import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../_common/services/http-service/types';
import blogsRepository from '../blogs-repository';






export const blogIdBodyInBDValidationMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const val = req.body.blogId
    const blog = await blogsRepository.readOne(val)
    if (!blog) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    // req.body.blogName = blog.name
    next()
}