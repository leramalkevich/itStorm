import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CommentsParamsType} from "../../../types/comments-params.type";
import {CommentsResponseType} from "../../../types/comments-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentActionsType} from "../../../types/comment-actions.type";

@Injectable({
    providedIn: 'root'
})
export class CommentsService {

    constructor(private http: HttpClient) {
    }

    getComments(params: CommentsParamsType): Observable<CommentsResponseType> {
        return this.http.get<CommentsResponseType>(environment.api + 'comments', {params: params});
    }

    addNewComment(text: string, articleId: string): Observable<DefaultResponseType> {
        return this.http.post<DefaultResponseType>(environment.api + 'comments', {
            text: text,
            article: articleId
        });
    }

    commentActions(commentId: string, action: string): Observable<DefaultResponseType> {
        return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {action: action});
    }

    getActionsForComment(commentId: string): Observable<DefaultResponseType | CommentActionsType[]> {
        return this.http.get<DefaultResponseType | CommentActionsType[]>(environment.api + 'comments/' + commentId + '/actions');
    }
    getUserArticleCommentActions(articleId: string): Observable<DefaultResponseType | {comment:string, action:string}[]> {
        return this.http.get<DefaultResponseType | {comment:string, action:string}[]>(environment.api + 'comments/article-comment-actions?articleId=' + articleId);
    }
}
