export interface CommentInputModel {
    content: string //   maxLength: 300     minLength: 20
}

export interface CommentViewModel {
    id: string //nullable: true //TODO может быть nullable
    content: string
    userId: string
    userLogin: string
    createdAt?: string//($date-time) 	//TODO в дз не обязательный в интерфей

}
export interface CommentBdModel {
    id: string //nullable: true
    content: string
    userId: string
    userLogin: string
    postId: string
    createdAt?: string//($date-time)
}