import {Component, inject, Input, OnInit} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {CommentsService} from "../../services/comments.service";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentsResponseType} from "../../../../types/comments-response.type";

@Component({
    selector: 'comment',
    standalone: false,
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    @Input() articleId: string = '';
    @Input() comment: CommentType = {
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
    };
    isLogged: boolean = false;
    countLikes: number = 0;
    countDislikes: number = 0;

    constructor(private commentsService: CommentsService, private authService: AuthService) {
        this.isLogged = this.authService.getIsLoggedIn();
    }

    ngOnInit(): void {
        if (this.comment) {
            this.countLikes = this.comment.likesCount;
            this.countDislikes = this.comment.dislikesCount;
        }
    }

    userReaction(commentId: string, reaction: string): void {
        if (this.isLogged) {
            this.commentsService.commentActions(commentId, reaction)
                .subscribe({
                    next: (data: DefaultResponseType) => {
                        if (data.error && data.message) {
                            this._snackBar.open(data.message);
                        }
                        if (reaction === 'violate' && !data.error) {
                            this._snackBar.open('Жалоба отправлена');
                        }
                        const params = {
                            offset: 0,
                            article: this.articleId
                        }
                        if (params) {
                            this.commentsService.getComments(params)
                                .subscribe({
                                    next: (updatedComments: CommentsResponseType) => {
                                        const changedCommentAction = updatedComments.comments.find(item => item.id === this.comment.id);
                                        if (changedCommentAction) {
                                            this.comment = changedCommentAction;

                                            this.commentsService.getUserArticleCommentActions(this.articleId)
                                                .subscribe({
                                                    next: (userActionsResponse: DefaultResponseType | { comment: string, action: string }[]) => {
                                                        if (userActionsResponse as { comment: string, action: string }[]) {
                                                            const updateAction = (userActionsResponse as { comment: string, action: string }[]).find(item => item.comment === changedCommentAction.id);
                                                            if (updateAction) {
                                                                changedCommentAction.action = updateAction.action;
                                                            } else {
                                                                delete changedCommentAction.action;
                                                            }
                                                        }
                                                    }
                                                });
                                            this.countLikes = changedCommentAction.likesCount;
                                            this.countDislikes = changedCommentAction.dislikesCount;
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
        }
    }
}
