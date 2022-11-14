import authRepository from '../Auth/auth-repository';
import Repository from '../_common/abstractions/Repository/Repository';
import { Filter } from 'mongodb';
import mongoDbAdapter from '../_common/services/mongoDb-service/mongoDb-adapter';
import { AuthViewModel } from '../Auth/types';
import { AdapterType } from '../_common/services/mongoDb-service/types';



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
        // TODO возможно нужно удалять comments при удалении пользователя
    }
}


export default new UserRepository('users', mongoDbAdapter)







