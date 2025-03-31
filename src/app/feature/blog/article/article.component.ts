import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
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
import {CommentActionsType} from "../../../../types/comment-actions.type";

@Component({
    selector: 'app-article',
    standalone: false,
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    article: ArticleType = {
        id: '',
        title: '',
        description: '',
        image: '',
        date: new Date(),
        category: '',
        url: '',
        comments: [{
            id: '',
            text: '',
            date: new Date(),
            likesCount: 0,
            dislikesCount: 0,
            user: {
                id: '',
                name: ''
            }
        }],
        commentsCount: 0,
        text: ''
    };
    threeComments: CommentType[] = [];
    comments: CommentsResponseType | null = null;
    relatedArticles: RelatedArticlesType[] = [];
    serverStaticPath = environment.serverStaticPath;
    isLogged: boolean = false;
    firstThreeCommentsShown: number = 0;
    @ViewChild('moreComments') moreComments: ElementRef | undefined;

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
                        if (data.comments.length > 0 && data.comments.length <= 3) {
                            this.firstThreeCommentsShown = data.comments.length;
                        } else {
                            this.firstThreeCommentsShown = 3;
                        }
                        if (this.isLogged && data.comments.length > 0) {
                            this.commentsService.getUserArticleCommentActions(this.article.id)
                                .subscribe({
                                    next: (userActions: DefaultResponseType | { comment: string, action: string }[]) => {
                                        if ((userActions as DefaultResponseType).error && (userActions as DefaultResponseType).message) {
                                            this._snackBar.open((userActions as DefaultResponseType).message);
                                        }
                                        let userActionsForComments = userActions as { comment: string, action: string }[];
                                        if (userActionsForComments && userActionsForComments.length > 0) {
                                            this.threeComments.forEach(item => {
                                                const commentWithActions = userActionsForComments.find(comment => comment.comment === item.id);
                                                if (commentWithActions) {
                                                    item.action = commentWithActions.action;
                                                }
                                            });
                                        }
                                    }, error: (errorResponse: HttpErrorResponse) => {
                                        if (errorResponse.error && errorResponse.error.message) {
                                            this._snackBar.open(errorResponse.error.message);
                                        } else {
                                            this._snackBar.open('Ошибка');
                                        }
                                    }
                                });
                        }

                    }, error: (errorResponse: HttpErrorResponse) => {
                        if (errorResponse.error && errorResponse.error.message) {
                            this._snackBar.open(errorResponse.error.message);
                        } else {
                            this._snackBar.open('Что-то пошло не так...Обратитесь в тех поддержку');
                        }
                    }
                });
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
                });
        });
    }

    userReactionChangeHandler(comment: CommentType) {
        let offset = 0;
        if (this.threeComments.length > 0) {
            const replaceComment: number = this.threeComments.findIndex(item => item.id === comment.id);
            offset = replaceComment;
        }
        if (this.comments && this.comments.comments.length > 0) {
            const replaceComment: number = this.comments.comments.findIndex(item => item.id === comment.id);
            offset = replaceComment;
        }

        const params = {offset: offset, article: this.article.id};
        if (params) {
            this.commentsService.getComments(params)
                .subscribe({
                    next: (comments: CommentsResponseType) => {
                        const updatedComment = comments.comments.find(item => item.id === comment.id);
                        if (updatedComment) {
                            this.commentsService.getActionsForComment(updatedComment.id)
                                .subscribe({
                                    next: (data: DefaultResponseType | CommentActionsType[]) => {
                                        if ((data as DefaultResponseType).error && (data as DefaultResponseType).message) {
                                            this._snackBar.open((data as DefaultResponseType).message);
                                        }
                                        if ((data as CommentActionsType[]).length > 0) {
                                            const updateUserReaction = (data as CommentActionsType[]).find(item => item.comment === updatedComment.id);
                                            if (updateUserReaction) {
                                                updatedComment.action = updateUserReaction.action;
                                                comment.action = updatedComment.action;
                                            } else {
                                                delete updatedComment.action;
                                                comment.action = updatedComment.action;
                                            }
                                        } else {
                                            delete updatedComment.action;
                                            comment.action = updatedComment.action;
                                        }
                                    }
                                });
                            comment.likesCount = updatedComment.likesCount;
                            comment.dislikesCount = updatedComment.dislikesCount;
                            if (this.threeComments.length > 0) {
                                const replaceComment = this.threeComments.findIndex(item => item.id === comment.id);
                                if (replaceComment !== -1) {
                                    this.threeComments[replaceComment] = comment;
                                }
                            }
                            if (this.comments && this.comments.comments.length > 0) {
                                const replaceComment = this.comments.comments.findIndex(item => item.id === comment.id);
                                if (replaceComment !== -1) {
                                    this.comments.comments[replaceComment] = comment;
                                }
                            }
                        }
                    }
                });
        }
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

                            const params = { offset: 0, article: this.article.id };
                            if (params) {
                                this.commentsService.getComments(params)
                                    .subscribe({
                                        next: (updateComments: CommentsResponseType) => {
                                            this.threeComments = updateComments.comments.slice(0, 3);
                                            this.article.commentsCount = updateComments.allCount;
                                            this.comments = null;
                                            this.moreComments?.nativeElement.classList.remove('hide');

                                            if (this.threeComments.length > 0) {
                                                this.commentsService.getUserArticleCommentActions(this.article.id)
                                                    .subscribe({
                                                        next: (userActions: DefaultResponseType | { comment: string, action: string }[]) => {
                                                            if ((userActions as DefaultResponseType).error && (userActions as DefaultResponseType).message) {
                                                                this._snackBar.open((userActions as DefaultResponseType).message);
                                                            }
                                                            let userActionsForComments = userActions as { comment: string, action: string }[];
                                                            if (userActionsForComments && userActionsForComments.length > 0) {
                                                                this.threeComments.forEach(item => {
                                                                    const commentWithActions = userActionsForComments.find(comment => comment.comment === item.id);
                                                                    if (commentWithActions) {
                                                                        item.action = commentWithActions.action;
                                                                    }
                                                                });
                                                            }
                                                        }, error: (errorResponse: HttpErrorResponse) => {
                                                            if (errorResponse.error && errorResponse.error.message) {
                                                                this._snackBar.open(errorResponse.error.message);
                                                            } else {
                                                                this._snackBar.open('Ошибка');
                                                            }
                                                        }
                                                    });
                                            }
                                        }
                                    });
                            }
                        }
                    }
                });
        }
    }

    showHiddenComments(moreCommentsElement: HTMLElement): void {
        if (this.threeComments.length) {
            this.comments = {
                allCount: this.article.commentsCount,
                comments: [...this.threeComments]
            };
            this.threeComments = [];
        }

        if (this.comments) {
            const params = {
                offset: this.comments.comments.length,
                article: this.article.id
            };
            this.commentsService.getComments(params)
                .subscribe({
                    next: (newComments: CommentsResponseType) => {
                        if (!newComments || !newComments.comments.length) {
                            moreCommentsElement.classList.add('hide');
                            return;
                        }

                        //combining new comments with the loaded ones
                        if (this.comments) {
                            this.comments = {
                                allCount: newComments.allCount,
                                comments: [...this.comments.comments, ...newComments.comments]
                            };

                            if (this.comments.comments.length >= this.comments.allCount) {
                                moreCommentsElement.classList.add('hide');
                            }
                            if (this.isLogged) {
                                this.loadUserCommentActions();
                            }
                        }

                    }, error: (errorResponse: HttpErrorResponse) => {
                        if (errorResponse.error && errorResponse.error.message) {
                            this._snackBar.open(errorResponse.error.message);
                        } else {
                            this._snackBar.open('Ошибка при загрузке комментариев');
                        }
                    }
                });
        }
    }

    private loadUserCommentActions(): void {
        this.commentsService.getUserArticleCommentActions(this.article.id)
            .subscribe({
                next: (userActions: DefaultResponseType | { comment: string, action: string }[]) => {
                    if ((userActions as DefaultResponseType).error) {
                        this._snackBar.open((userActions as DefaultResponseType).message || 'Что-то пошло не так...');
                        return;
                    }
                    const actions = userActions as { comment: string, action: string }[];
                    if (this.comments && this.comments?.comments.length) {
                        this.comments.comments.forEach(comment => {
                            const action = actions.find(item => item.comment === comment.id);
                            comment.action = action?.action || '';
                        });
                    }
                    if (this.threeComments.length) {
                        this.threeComments.forEach(comment => {
                            const action = actions.find(item => item.comment === comment.id);
                            comment.action = action?.action || '';
                        })
                    }

                }, error: (errorResponse: HttpErrorResponse) => {
                    if (errorResponse.error && errorResponse.error.message) {
                        this._snackBar.open(errorResponse.error.message);
                    } else {
                        this._snackBar.open('Ошибка загрузки действий');
                    }
                }
            })
    }
}
