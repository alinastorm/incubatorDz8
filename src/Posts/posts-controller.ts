import { Request } from 'express';
import { Filter } from 'mongodb';
import blogsRepository from '../Blogs/blogs-repository';
import { BlogViewModel } from '../Blogs/types';
import commentsRepository from '../Comments/comments-repository';
import { CommentBdModel, CommentInputModel, CommentViewModel } from '../Comments/types';
import { UserViewModel } from '../Users/types';
import usersRepository from '../Users/users-repository';
import { Paginator, SearchPaginationModel } from '../_common/repository/types';
import { HTTP_STATUSES, RequestWithBody, RequestWithParams, RequestWithParamsBody, RequestWithParamsQuery, RequestWithQuery, ResponseWithBodyCode, ResponseWithCode } from '../_common/services/http-service/types';
import { NoExtraProperties } from '../_common/types/types';
import postsRepository from './posts-repository';
import { PostInputModel, PostViewModel } from './types';


class PostsController {

    async readAll(req: Request, res: ResponseWithCode<200>) {
        const result = await postsRepository.readAll()
        res.status(HTTP_STATUSES.OK_200).send(JSON.stringify(result))
    }
    async readAllPaginationSort(
        req: RequestWithQuery<{ pageNumber: number, pageSize: number, sortBy: keyof PostViewModel, sortDirection: 1 | -1 }>,
        res: ResponseWithBodyCode<Paginator<PostViewModel[]>, 200>
    ) {
        const { pageNumber, pageSize, sortBy, sortDirection } = req.query
        const query: SearchPaginationModel<PostViewModel> = { pageNumber, pageSize, sortBy, sortDirection }
        const posts: Paginator<PostViewModel[]> = await postsRepository.readAllOrByPropPaginationSort(query)

        res.status(HTTP_STATUSES.OK_200).json(posts)
    }
    async createOne(
        req: RequestWithBody<PostInputModel>,
        res: ResponseWithBodyCode<PostViewModel, 201 | 400>) {

        const { blogId, content, shortDescription, title } = req.body
        const blog = await blogsRepository.readOne<BlogViewModel>(blogId)
        if (!blog) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        const { name: blogName } = blog

        const createdAt = new Date().toISOString()
        const query: Omit<PostViewModel, 'id'> = { blogId, blogName, content, createdAt, shortDescription, title }
        const id: string = await postsRepository.createOne(query)

        const post: PostViewModel | null = await postsRepository.readOne(id)
        if (!post) return res.status(HTTP_STATUSES.BAD_REQUEST_400)
        res.status(HTTP_STATUSES.CREATED_201).send(post)
    }
    async readOne(req: RequestWithParams<{ postId: string }>, res: ResponseWithBodyCode<PostViewModel, 200 | 404>) {
        const id = req.params.postId
        const post = await postsRepository.readOne<PostViewModel>(id)
        if (!post) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        res.status(HTTP_STATUSES.OK_200).send(post)
    }
    async updateOne(
        req: RequestWithParamsBody<{ postId: string }, PostInputModel>,
        res: ResponseWithCode<204 | 404>) {

        const id = req.params.postId
        const { blogId, content, shortDescription, title } = req.body

        const query: Partial<PostViewModel> = { blogId, content, shortDescription, title }
        const post = await postsRepository.readOne(id)
        if (!post) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        await postsRepository.updateOne(id, query)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteOne(req: RequestWithParams<{ postId: string }>, res: ResponseWithCode<204 | 404>) {
        const postId = req.params.postId
        const post = await postsRepository.readOne<PostViewModel>(postId)
        if (!post) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        const isDeleted = await postsRepository.deleteOne(post.id)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteAll(req: Request, res: ResponseWithCode<204>) {
        await postsRepository.deleteAll()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async getCommentsByPostIdPaginationSort(
        req: RequestWithParamsQuery<{ postId: string }, { pageNumber: number, pageSize: number, sortBy: keyof CommentBdModel, sortDirection: 1 | -1 }>,
        res: ResponseWithBodyCode<Paginator<CommentViewModel>, 200 | 404>
    ) {

        const { pageNumber, pageSize, sortBy, sortDirection } = req.query
        const postId = req.params.postId
        const filter: Filter<CommentBdModel> = { postId }
        const query: SearchPaginationModel<CommentBdModel> = { pageNumber, pageSize, sortBy, sortDirection, filter }
        {
            const comments = await commentsRepository.readAllOrByPropPaginationSort<CommentBdModel>(query)
            const { items, ...other } = comments
            const mapComments: Paginator<CommentViewModel> = {
                items: items.map((el) => {
                    const { postId, ...other } = el
                    return other
                }),
                ...other,
            }
            const result: NoExtraProperties<Paginator<CommentViewModel>, typeof mapComments> = mapComments
            return res.status(200).send(result)
        }
    }
    async createCommentsByPostId(
        req: RequestWithParamsBody<{ postId: string }, CommentInputModel> & { userId: string },
        res: ResponseWithBodyCode<CommentViewModel, 201 | 401 | 404>
    ) {
        const postId = req.params.postId
        const post = await postsRepository.readOne<CommentBdModel>(postId)
        if (!post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        const userId = req.userId
        const user = await usersRepository.readOne<UserViewModel>(userId)
        if (!user) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

        const { login: userLogin } = user
        const createdAt = new Date().toISOString()
        const content = req.body.content
        const query: Omit<CommentBdModel, 'id'> = { content, userId, userLogin, createdAt, postId }
        const idComment: string = await commentsRepository.createOne(query)
        {
            const comment = await commentsRepository.readOne<CommentBdModel>(idComment)
            if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            const { postId, ...other } = comment
            const mapComment: NoExtraProperties<CommentViewModel, typeof other> = other
            res.status(201).send(mapComment)
        }
    }

}
export default new PostsController()
