import express from 'express';
import { titleBodyValidationMiddleware } from '../_common/middlewares/title-validation-middleware';
import { postIdParamValidationMiddleware } from '../_common/middlewares/postIdParam-validation-middleware';
import { contentBodyValidationMiddleware } from '../_common/middlewares/content-validation-middleware';
import { shortdescriptionBodyValidationMiddleware } from '../_common/middlewares/shortdescription-validation-middleware';
import { authorizationBasicMiddleware401 } from '../_common/middlewares/authBasic-validation-middleware';
import { mainValidator400 } from '../_common/middlewares/mainValidator-middleware';
import { pageNumberQueryValidationMiddleware } from '../_common/middlewares/pageNumber-validation-middleware';
import { pageSizeQueryValidationMiddleware } from '../_common/middlewares/pageSize-validation-middleware';
import { sortByPostsQueryValidationMiddleware } from '../_common/middlewares/sortByPosts-validation-middleware';
import { sortDirectionQueryValidationMiddleware } from '../_common/middlewares/sortDirection-validation-middleware';

import { commentsInputModelSchemaValidationMiddleware } from '../_common/middlewares/commentsInputSchema-validation-middleware';
import { sortByCommentsQueryValidationMiddleware } from '../_common/middlewares/sortByComments-validation-middleware';
import { authJwtBearerMiddleware } from '../_common/middlewares/authJwtBearer-middleware';
import postsController from './posts-controller';
import { postParamIdInBDValidationMiddleware } from './validators/PostsIdParamInBD-validation-middleware';
import { blogIdBodyInBDValidationMiddleware } from '../Blogs/validators/blogIdBodyInBD-validation-middleware';

const mainRoute = 'posts'

export const postsRoutes = express.Router()


postsRoutes.get(`/posts/:postId/comments`,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByCommentsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    mainValidator400,
    postParamIdInBDValidationMiddleware,
    <any>postsController.getCommentsByPostIdPaginationSort)

postsRoutes.post(`/posts/:postId/comments`,
    <any>authJwtBearerMiddleware,
    postIdParamValidationMiddleware,
    commentsInputModelSchemaValidationMiddleware,
    mainValidator400,
    // postParamIdInBDValidationMiddleware,
    <any>postsController.createCommentsByPostId)


postsRoutes.get(`/posts`,
    pageNumberQueryValidationMiddleware,
    pageSizeQueryValidationMiddleware,
    sortByPostsQueryValidationMiddleware,
    sortDirectionQueryValidationMiddleware,
    mainValidator400,
    <any>postsController.readAllPaginationSort)

postsRoutes.post(`/posts`,
    authorizationBasicMiddleware401,
    titleBodyValidationMiddleware,
    shortdescriptionBodyValidationMiddleware,
    contentBodyValidationMiddleware,
    blogIdBodyInBDValidationMiddleware,
    mainValidator400,
    // bloggerBodyIdInBDValidationMiddleware,
    postsController.createOne)

postsRoutes.get(`/posts/:postId`,
    postIdParamValidationMiddleware,
    mainValidator400,
    postParamIdInBDValidationMiddleware,
    postsController.readOne)

postsRoutes.put(`/posts/:postId`,
    authorizationBasicMiddleware401,
    postIdParamValidationMiddleware,
    titleBodyValidationMiddleware,
    shortdescriptionBodyValidationMiddleware,
    contentBodyValidationMiddleware,
    blogIdBodyInBDValidationMiddleware,
    mainValidator400,
    postParamIdInBDValidationMiddleware,
    // bloggerBodyIdInBDValidationMiddleware,
    postsController.updateOne)

postsRoutes.delete(`/posts/:postId`,
    authorizationBasicMiddleware401,
    postIdParamValidationMiddleware,
    mainValidator400,
    postParamIdInBDValidationMiddleware,
    postsController.deleteOne)


