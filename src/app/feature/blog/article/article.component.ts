import {Component, inject, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RelatedArticlesType} from "../../../../types/related-articles.type";
import {ArticleService} from "../../../shared/services/article.service";
import {CommentsService} from "../../../shared/services/comments.service";
import {CommentsResponseType} from "../../../../types/comments-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentType} from "../../../../types/comment.type";

@Component({
    selector: 'app-article',
    standalone: false,
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    article!: ArticleType;
    threeComments:CommentType[]=[];
    comments!: CommentsResponseType;
    relatedArticles: RelatedArticlesType[] = [];
    serverStaticPath = environment.serverStaticPath;
    isLogged: boolean = false;

    constructor(private articleService: ArticleService, private activatedRoute: ActivatedRoute,
                private commentsService: CommentsService, private authService: AuthService) {
        this.isLogged = this.authService.getIsLoggedIn();
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.articleService.getArticle(params['url'])
                .subscribe({
                    next: (data: ArticleType) => {
                        this.article = data;
                        this.threeComments = data.comments;
                    }, error: (errorResponse: HttpErrorResponse) => {
                        if (errorResponse.error && errorResponse.error.message) {
                            this._snackBar.open(errorResponse.error.message);
                        } else {
                            this._snackBar.open('Что-то пошло не так...Обратитесь в тех поддержку');
                        }
                    }
                })
            this.articleService.getRelatedArticles(params['url'])
                .subscribe({
                    next: (data: RelatedArticlesType[]) => {
                        if (data && data.length > 0) {
                            this.relatedArticles = data
                        }
                    }, error: (errorResponse: HttpErrorResponse) => {
                        if (errorResponse.error && errorResponse.error.message) {
                            this._snackBar.open(errorResponse.error.message);
                        } else {
                            this._snackBar.open('Что-то пошло не так...Обратитесь в тех поддержку');
                        }
                    }
                })
        });
    }

    addNewComment(text: HTMLElement): void {
        if (this.isLogged) {
            this.commentsService.addNewComment((text as HTMLInputElement).value, this.article.id)
                .subscribe({
                    next: (dataResponse: DefaultResponseType) => {
                        if (dataResponse.error && dataResponse.message) {
                            this._snackBar.open(dataResponse.message);
                        } else {
                            (text as HTMLInputElement).value = '';
                            this._snackBar.open(dataResponse.message);
                        }
                    }
                });
        }
    }

    showHiddenComments(moreCommentsElement:HTMLElement):void{
        if (this.article && this.article.commentsCount && this.article.commentsCount <= 13) {
            moreCommentsElement.classList.add('hide');
        }
        let params = {
            offset: 3,
            article: this.article.id
        }
        if (params) {
            this.commentsService.getComments(params)
                .subscribe({
                    next: (data: CommentsResponseType) => {
                        this.comments = data;
                    }, error: (errorResponse: HttpErrorResponse) => {
                        if (errorResponse.error && errorResponse.error.message) {
                            this._snackBar.open(errorResponse.error.message);
                        } else {
                            this._snackBar.open('Что-то пошло не так...Обратитесь в тех поддержку');
                        }
                    }
                });
        }
    }
}
