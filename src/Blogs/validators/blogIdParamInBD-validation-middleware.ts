import { NextFunction, Response } from 'express';
import { HTTP_STATUSES } from '../../_common/services/http-service/types';
import blogsRepository from '../blogs-repository';





export const blogIdParamInBDValidationMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const blogId = req.params.blogId
    const blog = await blogsRepository.readOne(blogId)
    if (!blog) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    // req.params.blogName = blog.name
    next()
}