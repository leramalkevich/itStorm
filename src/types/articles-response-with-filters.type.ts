export type ArticlesResponseWithFiltersType = {
    id: string,
    title: string,
    description: string,
    image: string,
    date: Date,
    category: string,
    url: string,
    categories?:{name:string}
}