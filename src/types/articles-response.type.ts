export type ArticlesResponseType = {
    count:number,
    pages:number,
    items: {
        id: string,
        title: string,
        description: string,
        image: string,
        date: Date,
        category: string,
        url: string
    }[]
}