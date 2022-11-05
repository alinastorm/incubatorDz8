export interface BlogInputModel {
    name: string//    maxLength: 15
    youtubeUrl: string // maxLength: 100     pattern: ^ https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}
export interface BlogPostInputModel {
    title: string//    maxLength: 30
    shortDescription: string//    maxLength: 100
    content: string//    maxLength: 1000
}

export interface BlogViewModel {
    id: string
    name: string// max 15
    youtubeUrl: string
    createdAt: string//TODO в дз не обязательный в интерфейсе
}