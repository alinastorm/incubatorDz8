import { Filter } from 'mongodb';
import mongoDbAdapter from '../_common/services/mongoDb-service/mongoDb-adapter';
import commentsRepository from '../Comments/comments-repository';
import Repository from '../_common/abstractions/Repository/Repository';
import { AdapterType } from '../_common/services/mongoDb-service/types';
import { CommentBdModel } from '../Comments/types';




//написал тестовый DI    
class PostsRepository extends Repository {
    constructor(collectionName: string, dataService: AdapterType) { super(collectionName, dataService) }

    async deleteOne(id: string): Promise<boolean> {
        const isPostDeleted = await super.deleteOne(id)
        if (!isPostDeleted) return false

        const filter: Partial<CommentBdModel> = { postId: id }
        const comments = await commentsRepository.readAll<CommentBdModel>(filter)
        comments.forEach(async ({ id }) => {
            await commentsRepository.deleteOne(id)
        })
        return true
    }
}


export default new PostsRepository("posts", mongoDbAdapter)








