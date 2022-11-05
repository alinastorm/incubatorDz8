import { Request } from 'express';
import { Filter } from 'mongodb';

import postsRepository from '../Posts/posts-repository';
import blogsRepository from './blogs-repository';
import { BlogInputModel, BlogPostInputModel, BlogViewModel } from './types';
import { PostViewModel } from '../Posts/types';
import { HTTP_STATUSES, RequestWithBody, RequestWithParams, RequestWithParamsBody, RequestWithParamsQuery, RequestWithQuery, ResponseWithBodyCode, ResponseWithCode } from '../_common/services/http-service/types';
import { Paginator, SearchPaginationModel } from '../_common/repository/types';



class BlogController {


    async readAllOrByNamePaginationSort(
        req: RequestWithQuery<{ searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: keyof BlogViewModel, sortDirection: 1 | -1 }>,
        res: ResponseWithBodyCode<Paginator<BlogViewModel[]>, 200>
    ) {
        const { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection } = req.query
        const query: SearchPaginationModel = { pageNumber, pageSize, sortBy, sortDirection }
        if (searchNameTerm) query['filter'] = { name: { $regex: searchNameTerm, $options: 'i' } }
        const result: Paginator<BlogViewModel[]> = await blogsRepository.readAllOrByPropPaginationSort(query)
        res.status(HTTP_STATUSES.OK_200).json(result)
    }
    async createOne(
        req: RequestWithBody<BlogInputModel>,
        res: ResponseWithBodyCode<BlogViewModel, 201 | 404>
    ) {

        const { name, youtubeUrl } = req.body
        const createdAt = new Date().toISOString()
        const element: Omit<BlogViewModel, "id"> = { createdAt, name, youtubeUrl }

        const id: string = await blogsRepository.createOne(element)
        const users: BlogViewModel | null = await blogsRepository.readOne(id)
        if (!users) return res.status(HTTP_STATUSES.NOT_FOUND_404)

        res.status(HTTP_STATUSES.CREATED_201).send(users)
    }
    async readOne(
        req: RequestWithParams<{ blogId: string }>,
        res: ResponseWithBodyCode<BlogViewModel, 200 | 404>
    ) {
        const id = req.params.blogId
        const result = await blogsRepository.readOne<BlogViewModel>(id)
        if (!result) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        res.status(HTTP_STATUSES.OK_200).send(result)
    }
    async readAllPostsByBlogIdWithPaginationAndSort(
        req: RequestWithParamsQuery<{ blogId: string }, { pageNumber: number, pageSize: number, sortBy: keyof PostViewModel, sortDirection: 1 | -1 }>,
        res: ResponseWithBodyCode<Paginator<PostViewModel[]>, 200 | 404>
    ) {
        const blogId = req.params.blogId
        const { pageNumber, pageSize, sortBy, sortDirection } = req.query
        const filter: Filter<PostViewModel> = { blogId }

        const query: SearchPaginationModel = { pageNumber, pageSize, sortBy, sortDirection, filter }
        const result: Paginator<PostViewModel[]> = await postsRepository.readAllOrByPropPaginationSort(query)
        if (!result) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        res.status(HTTP_STATUSES.OK_200).send(result)
    }
    async createPostsByBlogId(
        req: RequestWithParamsBody<{ blogId: string }, BlogPostInputModel>,
        res: ResponseWithBodyCode<PostViewModel, 201 | 404>
    ) {
        const blogId = req.params.blogId
        const { content, shortDescription, title } = req.body
        const blog = await blogsRepository.readOne<BlogViewModel>(blogId)
        if (!blog) return res.status(HTTP_STATUSES.NOT_FOUND_404)
        const { name: blogName } = blog
        const createdAt = new Date().toISOString()
        const query: Omit<PostViewModel, 'id'> = { blogId, blogName, content, createdAt, shortDescription, title }
        const id = await postsRepository.createOne(query)
        const post: PostViewModel | null = await postsRepository.readOne<PostViewModel>(id)
        if (!post) return res.status(HTTP_STATUSES.NOT_FOUND_404)
        res.status(HTTP_STATUSES.CREATED_201).send(post)
    }
    async updateOne(
        req: RequestWithParams<{ blogId: string }>,
        res: ResponseWithCode<204 | 404>
    ) {
        const body = req.body
        const id = req.params.blogId
        const result = await blogsRepository.readOne(id)
        if (!result) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        await blogsRepository.updateOne(id, body)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async replaceOne(
        req: RequestWithParams<{ blogId: string }>,
        res: ResponseWithCode<204 | 404>
    ) {
        const body = req.body
        const id = req.params.blogId
        const result = await blogsRepository.readOne(id)
        if (!result) {
            return res.status(HTTP_STATUSES.NOT_FOUND_404).send('Not Found')
        }
        await blogsRepository.replaceOne(id, body)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteOne(
        req: RequestWithParams<{ blogId: string }>,
        res: ResponseWithCode<204 | 404 | 500>
    ) {
        const id = req.params.blogId
        const result = await blogsRepository.readOne(id)
        if (!result) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        if (await blogsRepository.deleteOne(id)) return res.sendStatus(204)
        return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
    }
    async deleteAll(
        req: Request,
        res: ResponseWithCode<204>
    ) {
        await blogsRepository.deleteAll()
        res.status(HTTP_STATUSES.NO_CONTENT_204).send(JSON.stringify('All data is deleted'))
    }
}
export default new BlogController()