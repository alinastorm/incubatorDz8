import { Filter } from 'mongodb';
import mongoDbAdapter from '../_common/services/mongoDb-service/mongoDb-adapter';
import { AdapterType } from '../_common/services/mongoDb-service/types';
import Repository from '../_common/abstractions/Repository/Repository';
import registrationCodeRepository from './registrationCode-repository';
import { RegistrationCodeViewModel } from './types';


class AuthRepository extends Repository {
    constructor(collectionName: string, dataService: AdapterType) { super(collectionName, dataService) }

    async deleteOne(id: string) {
        // Удаляем auth        
        const isDeleted = await super.deleteOne(id)
        if (!isDeleted) return false
        // Удаляем registration codes
        const filter: Partial<RegistrationCodeViewModel> = { userId: id }
        const codes = await registrationCodeRepository.readAll<RegistrationCodeViewModel>(filter)
        codes.forEach((code) => {
            registrationCodeRepository.deleteOne(code.id)
        })
        return true
    }
}


export default new AuthRepository('auth', mongoDbAdapter)