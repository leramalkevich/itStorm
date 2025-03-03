import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {PopularArticlesResponseType} from "../../types/popular-articles-response.type";
import {environment} from "../../environments/environment";
import {ArticlesResponseType} from "../../types/articles-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http:HttpClient) { }
  getPopularArticles():Observable<DefaultResponseType|PopularArticlesResponseType[]>{
    return this.http.get<PopularArticlesResponseType[]|DefaultResponseType>(environment.api+'articles/top');
  }
  getArticles():Observable<DefaultResponseType|ArticlesResponseType>{
    return this.http.get<ArticlesResponseType|DefaultResponseType>(environment.api+'articles');
  }
}
