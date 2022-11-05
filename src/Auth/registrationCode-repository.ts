import mongoDbAdapter from '../_common/db/mongo/mongoDb-adapter';
import { AdapterType } from '../_common/db/mongo/types';
import Repository from '../_common/repository/Repository';


class RegistrationCodeRepository extends Repository {
    constructor(collectionName: string, dataService: AdapterType) { super(collectionName, dataService) }

}


export default new RegistrationCodeRepository('registrationCodes', mongoDbAdapter)