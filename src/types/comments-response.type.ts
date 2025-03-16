export type CommentsResponseType = {
    allCount: number,
    comments: {
        id: string,
        text: string,
        date: Date,
        likesCount: number,
        dislikesCount: number,
        user: {
            id: string,
            name: string
        },
        action?:string|null
    }[]
}