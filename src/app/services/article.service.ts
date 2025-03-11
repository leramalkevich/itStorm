import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {PopularArticlesResponseType} from "../../types/popular-articles-response.type";
import {environment} from "../../environments/environment";
import {ArticlesResponseType} from "../../types/articles-response.type";
import {CategoriesResponseType} from "../../types/categories-response.type";
import {ArticleType} from "../../types/article.type";
import {RelatedArticlesType} from "../../types/related-articles.type";
import {ActiveParamsType} from "../../types/active-params.type";

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    constructor(private http: HttpClient) {
    }

    getPopularArticles(): Observable<DefaultResponseType | PopularArticlesResponseType[]> {
        return this.http.get<PopularArticlesResponseType[] | DefaultResponseType>(environment.api + 'articles/top');
    }

    getArticles(): Observable<ArticlesResponseType> {
        return this.http.get<ArticlesResponseType>(environment.api + 'articles');
    }
    getArticlesWithCategories(params:ActiveParamsType): Observable<ArticlesResponseType> {
        return this.http.get<ArticlesResponseType>(environment.api + 'articles', {params:params});
    }

    getArticlesCategories(): Observable<CategoriesResponseType[]> {
        return this.http.get<CategoriesResponseType[]>(environment.api + 'categories');
    }

    getArticle(url: string): Observable<ArticleType> {
        return this.http.get<ArticleType>(environment.api + 'articles/' + url);
    }
    getRelatedArticles(url: string): Observable<RelatedArticlesType[]> {
        return this.http.get<RelatedArticlesType[]>(environment.api + 'articles/related/' + url);
    }

}
