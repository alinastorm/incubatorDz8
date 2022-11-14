
import Repository from '../_common/abstractions/Repository/Repository';
import mongoDbAdapter from '../_common/services/mongoDb-service/mongoDb-adapter';
import { AdapterType } from '../_common/services/mongoDb-service/types';



class CommentsRepository extends Repository {
    constructor(collectionName: string, dataService: AdapterType) { super(collectionName, dataService) }

}


export default new CommentsRepository("comments", mongoDbAdapter)







