
export interface UserViewModel {
    id: string
    login: string
    email: string
    confirm:boolean //мое
    createdAt?: string //	TODO в дз не обязательный в интерфей
}

export interface UserInputModel {
    login: string // maxLength: 10 minLength: 3
    password: string // maxLength: 20 minLength: 6
    email: string // pattern: ^ [\w -\.] +@([\w -] +\.) +[\w -]{ 2, 4 } $
}

export interface UsersSearchPaginationModel {
    /**Search term for user Login: Login should contains this term in any position
     * Default value : null
     */
    searchLoginTerm: string
    /**Search term for user Email: Email should contains this term in any position
     * Default value : null
     */
    searchEmailTerm: string
    /**PageNumber is number of portions that should be returned.
     * Default value : 1
     */
    pageNumber: number
    /**PageSize is portions size that should be returned
     * Default value : 10
     */
    pageSize: number
    /** Sorting term
     * Default value : createdAt
     */
    sortBy: string
    /** Sorting direction
     * Default value: desc
     */
    sortDirection: 1 | -1
}