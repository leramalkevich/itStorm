import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ActivatedRoute, Router} from "@angular/router";
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
    comments: CommentsResponseType = {
        allCount: 0,
        comments: [{
            id: '',
            text: '',
            date: new Date(),
            likesCount: 0,
            dislikesCount: 0,
            user: {
                id: '',
                name: ''
            },
            action: ''
        }]
    };
    relatedArticles: RelatedArticlesType[] = [];
    serverStaticPath = environment.serverStaticPath;
    isLogged: boolean = false;
    firstThreeCommentsShown: number = 0;
    @ViewChild('moreComments') moreComments: ElementRef | undefined;

    constructor(private articleService: ArticleService, private activatedRoute: ActivatedRoute,
                private commentsService: CommentsService, private authService: AuthService, private router: Router) {
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
        if (this.firstThreeCommentsShown <= 3) {
            offset = 0;
        } else if (this.firstThreeCommentsShown > 3 && this.firstThreeCommentsShown <= 13) {
            offset = 3;
        } else if (this.firstThreeCommentsShown > 13) {
            offset = this.firstThreeCommentsShown - 10;
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
                            if (this.comments.comments.length > 0) {
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

                            const params = {
                                offset: 0,
                                article: this.article.id
                            }
                            if (params) {
                                this.commentsService.getComments(params)
                                    .subscribe({
                                        next: (updateComments: CommentsResponseType) => {
                                            if ((this.threeComments && this.article.commentsCount < 3) || this.threeComments.length === 0) {
                                                this.threeComments = updateComments.comments;
                                                this.article.commentsCount = updateComments.allCount;
                                                this.firstThreeCommentsShown = this.threeComments.length;
                                            } else if ((this.threeComments && this.article.commentsCount >= 3) || (this.threeComments.length === 0 && this.comments.allCount !== 0)) {
                                                this.threeComments = updateComments.comments.slice(0, 3);
                                                this.article.commentsCount = updateComments.allCount;
                                                this.firstThreeCommentsShown = 3;
                                                this.comments = {allCount: updateComments.allCount, comments: []};
                                                this.moreComments?.nativeElement.classList.remove('hide');
                                            }
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
        let params = {
            offset: this.firstThreeCommentsShown,
            article: this.article.id
        }
        if (params) {
            this.commentsService.getComments(params)
                .subscribe({
                    next: (data: CommentsResponseType) => {
                        if (data) {
                            let restCommentsCount = data.allCount - this.firstThreeCommentsShown;
                            if (restCommentsCount > 10) {
                                this.firstThreeCommentsShown += 10;
                            } else {
                                this.firstThreeCommentsShown = this.firstThreeCommentsShown + restCommentsCount;
                            }
                            if (data.allCount === this.firstThreeCommentsShown) {
                                moreCommentsElement.classList.add('hide');
                            }
                            this.comments = data;
                            this.threeComments = [];
                            if (this.isLogged && data.comments.length > 0) {
                                this.commentsService.getUserArticleCommentActions(this.article.id)
                                    .subscribe({
                                        next: (userActions: DefaultResponseType | { comment: string, action: string }[]) => {
                                            if ((userActions as DefaultResponseType).error && (userActions as DefaultResponseType).message) {
                                                this._snackBar.open((userActions as DefaultResponseType).message);
                                            }
                                            let userActionsForComments = userActions as { comment: string, action: string }[];
                                            if (userActionsForComments && userActionsForComments.length > 0) {
                                                this.comments.comments.forEach(item => {
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
                            this.router.navigate([], {fragment: "moreCommentsBlock"});
                        }

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
