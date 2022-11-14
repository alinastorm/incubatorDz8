import mongoDbAdapter from '../_common/services/mongoDb-service/mongoDb-adapter';
import { AdapterType } from '../_common/services/mongoDb-service/types';
import Repository from '../_common/abstractions/Repository/Repository';

/**Временное хранение невалидных токенов */
class TokensRepository extends Repository {
    constructor(collectionName: string, dataService: AdapterType) { super(collectionName, dataService) }

}


export default new TokensRepository('tokens', mongoDbAdapter)