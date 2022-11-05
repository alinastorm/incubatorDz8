import authRepository from '../Auth/auth-repository';
import Repository from '../_common/repository/Repository';
import { Filter } from 'mongodb';
import mongoDbAdapter from '../_common/db/mongo/mongoDb-adapter';
import { AuthViewModel } from '../Auth/types';
import { AdapterType } from '../_common/db/mongo/types';



class UserRepository extends Repository {
    constructor(collectionName: string, dataService: AdapterType) { super(collectionName, dataService) }


    async deleteOne(id: string) {
        // Удаляем users        
        const isDeleted = await super.deleteOne(id)
        if (!isDeleted) return false
        // Удаляем auth
        const filter: Partial<AuthViewModel> = { userId: id }
        const auths = await authRepository.readAll(filter)
        auths.forEach((auth) => {
            authRepository.deleteOne(auth.id)
        })
        return true
        // TODO возможно нужно удалять comments
    }
}


export default new UserRepository('users', mongoDbAdapter)







