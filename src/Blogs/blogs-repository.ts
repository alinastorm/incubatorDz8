import { Filter } from 'mongodb';
import postsRepository from '../Posts/posts-repository';
import { PostViewModel } from '../Posts/types';
import mongoDbAdapter from '../_common/db/mongo/mongoDb-adapter';
import { AdapterType } from '../_common/db/mongo/types';

import Repository from '../_common/repository/Repository';
import { BlogViewModel } from './types';




class BlogsRepository extends Repository {
    constructor(collectionName: string, dataService: AdapterType) { super(collectionName, dataService) }

    async deleteOne(id: string): Promise<boolean> {

        const isBlogDeleted = await super.deleteOne(id)
        if (!isBlogDeleted) return false

        const filter: Partial<PostViewModel> = { blogId: id }
        const posts = await postsRepository.readAll<BlogViewModel>(filter)
        posts.forEach(async ({ id }) => {
            await postsRepository.deleteOne(id)
        })

        return true

    }
}


export default new BlogsRepository('blogs', mongoDbAdapter)







