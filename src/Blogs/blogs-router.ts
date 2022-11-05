import express from 'express';
import { nameBodyValidationMiddleware } from '../_common/middlewares/name-validation-middleware';
import { youtubeUrlBodyValidationMiddleware } from '../_common/middlewares/youtubeUrl-validation-middleware';
import { authorizationBasicMiddleware401 } from '../_common/middlewares/authBasic-validation-middleware';
import { mainValidator400 } from '../_common/middlewares/mainValidator-middleware';
import { searchNameTermQueryValidationMiddleware } from '../_common/middlewares/searchNameTerm-query-validation-middleware';
import { pageNumberQueryValidationMiddleware } from '../_common/middlewares/pageNumber-validation-middleware';
import { sortByBlogsQueryValidationMiddleware } from '../_common/middlewares/sortByBlogs-validation-middleware';
import { pageSizeQueryValidationMiddleware } from '../_common/middlewares/pageSize-validation-middleware';
import { sortDirectionQueryValidationMiddleware } from '../_common/middlewares/sortDirection-validation-middleware';
import { blogIdParamUriValidationMiddleware } from '../_common/middlewares/blogId-param-validation-middleware';
import { titleBodyValidationMiddleware } from '../_common/middlewares/title-validation-middleware';
import { shortdescriptionBodyValidationMiddleware } from '../_common/middlewares/shortdescription-validation-middleware';
import { contentBodyValidationMiddleware } from '../_common/middlewares/content-validation-middleware';

import { sortByPostsQueryValidationMiddleware } from '../_common/middlewares/sortByPosts-validation-middleware';
import blogsController from './blogs-controller';
import { blogIdParamInBDValidationMiddleware } from './validators/blogIdParamInBD-validation-middleware';


export const blogsRoutes = express.Router()


blogsRoutes.get(`/blogs`,
    searchNameTermQueryValidationMiddleware,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByBlogsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    blogsController.readAllOrByNamePaginationSort)

blogsRoutes.post(`/blogs`,
    authorizationBasicMiddleware401,
    nameBodyValidationMiddleware,
    youtubeUrlBodyValidationMiddleware,
    mainValidator400,
    blogsController.createOne)

blogsRoutes.get(`/blogs/:blogId/posts`,
    blogIdParamUriValidationMiddleware,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByPostsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    mainValidator400,
    blogIdParamInBDValidationMiddleware,
    <any>blogsController.readAllPostsByBlogIdWithPaginationAndSort)


blogsRoutes.post(`/blogs/:blogId/posts`,
    authorizationBasicMiddleware401,
    blogIdParamUriValidationMiddleware,
    titleBodyValidationMiddleware,
    shortdescriptionBodyValidationMiddleware,
    contentBodyValidationMiddleware,
    mainValidator400,
    blogIdParamInBDValidationMiddleware,
    blogsController.createPostsByBlogId)

blogsRoutes.get(`/blogs/:blogId`,
    blogIdParamUriValidationMiddleware,
    mainValidator400,
    blogIdParamInBDValidationMiddleware,
    blogsController.readOne)

blogsRoutes.put(`/blogs/:blogId`,
    authorizationBasicMiddleware401,
    blogIdParamUriValidationMiddleware,
    nameBodyValidationMiddleware,
    youtubeUrlBodyValidationMiddleware,
    mainValidator400,
    blogIdParamInBDValidationMiddleware,
    blogsController.updateOne)

blogsRoutes.delete(`/blogs/:blogId`,
    authorizationBasicMiddleware401,
    blogIdParamUriValidationMiddleware,
    mainValidator400,
    blogIdParamInBDValidationMiddleware,
    blogsController.deleteOne)


 