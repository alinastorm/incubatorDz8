import { IObject } from '../../types/types';
import { Filter } from 'mongodb';
import { AdapterType } from '../../services/mongoDb-service/types';
import { Paginator, SearchPaginationModel } from './types';

// const dataService = new DataService(mongoDbAdapter)


class Repository {

    constructor(private collectionName: string, private dataService: AdapterType) { }

    async readAll<T>(filter?: Filter<Partial<T>>) {
        const result: T[] = await this.dataService.readAll(this.collectionName, filter)
        return result
    }
    async readAllOrByPropPaginationSort<T>(data: SearchPaginationModel) {
        const { pageNumber, pageSize, sortBy, sortDirection, filter } = data
        const result: Paginator<T> = await this.dataService.readAllOrByPropPaginationSort(this.collectionName, pageNumber, pageSize, sortBy, sortDirection, filter)
        return result
    }
    async readOne<T>(id: string) {
        const result: T | null = await this.dataService.readOne(this.collectionName, id)
        return result
    }
    async createOne<T extends IObject>(element: Omit<T, "id">): Promise<string> {
        return await this.dataService.createOne(this.collectionName, element)
    }
    async updateOne<T>(id: string, data: Partial<T>) {
        const result: boolean = await this.dataService.updateOne(this.collectionName, id, data)
        return result
    }
    async replaceOne<T extends IObject>(id: string, data: T) {
        const result = await this.dataService.replaceOne(this.collectionName, id, data)
        return result
    }
    async deleteOne<T>(id: string): Promise<boolean> {
        return await this.dataService.deleteOne(this.collectionName, id)
    }
    async deleteAll(): Promise<boolean> {
        const result = await this.dataService.deleteAll(this.collectionName)
        return result
    }
}

export default Repository