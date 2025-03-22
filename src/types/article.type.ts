export type ArticleType = {
    id: string,
    title: string,
    description: string,
    image: string,
    date: Date,
    category: string,
    url: string,
    comments: {
        id: string,
        text: string,
        date: Date,
        likesCount: number,
        dislikesCount: number,
        user: {
            id: string,
            name: string
        }
    }[],
    commentsCount:number,
    text: string
}