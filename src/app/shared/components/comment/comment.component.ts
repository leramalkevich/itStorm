import {Component, inject, Input, OnInit} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentActionsType} from "../../../../types/comment-actions.type";
import {HttpErrorResponse} from "@angular/common/http";
import {CommentsService} from "../../services/comments.service";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'comment',
    standalone: false,
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    @Input() comment!: CommentType;
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
            if (this.isLogged) {
                this.commentsService.getActionsForComment(this.comment.id)
                    .subscribe({
                        next: (commentActions: DefaultResponseType | CommentActionsType[]) => {
                            if ((commentActions as DefaultResponseType).error && (commentActions as DefaultResponseType).message) {

                            }
                            if ((commentActions as CommentActionsType[]).length > 0) {
                                const commentWithAction = (commentActions as CommentActionsType[]).find(id => id.comment === this.comment.id);
                                if (commentWithAction) {
                                    this.comment.action = commentWithAction.action;
                                }
                            }
                        }
                    });
            }
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
                        this.commentsService.getActionsForComment(commentId)
                            .subscribe({
                                next: (actionsResponse: DefaultResponseType | CommentActionsType[]) => {
                                    if ((actionsResponse as DefaultResponseType).error && (actionsResponse as DefaultResponseType).message) {
                                        this._snackBar.open((actionsResponse as DefaultResponseType).message);
                                    }
                                    if ((actionsResponse as CommentActionsType[]).length > 0) {
                                        const actionsForComment = actionsResponse as CommentActionsType[];
                                        if (actionsForComment) {
                                            const foundComment = actionsForComment.find(item => item.comment === this.comment.id);
                                            if (foundComment) {
                                                if (this.comment.action) {
                                                    if (this.comment.action === 'like' && foundComment.action === 'like') {
                                                        this.countLikes--;
                                                    } else if (this.comment.action === 'dislike' && foundComment.action === 'dislike') {
                                                        this.countDislikes--;
                                                    } else if (this.comment.action === 'dislike' && foundComment.action === 'like') {
                                                        this.countDislikes--;
                                                        this.countLikes++;
                                                    } else if (this.comment.action === 'like' && foundComment.action === 'dislike') {
                                                        this.countLikes--;
                                                        this.countDislikes++;
                                                    }
                                                }
                                                if (this.comment.action === null && foundComment.action === 'like') {
                                                    if (this.comment.likesCount !== 0) {
                                                        this.countLikes = this.comment.likesCount;
                                                    } else {
                                                        this.countLikes++;
                                                    }
                                                } else if (this.comment.action === null && foundComment.action === 'dislike') {
                                                    if (this.comment.dislikesCount !== 0) {
                                                        this.countDislikes = this.comment.dislikesCount;
                                                    } else {
                                                        this.countDislikes++;
                                                    }
                                                }
                                                this.comment.action = foundComment.action;
                                            }
                                        }
                                    } else {
                                        if (this.comment.action && this.comment.action === reaction) {
                                            if (this.comment.action === 'like' && reaction === 'like') {
                                                this.countLikes--;
                                            } else if (this.comment.action === 'dislike' && reaction === 'dislike') {
                                                this.countDislikes = this.comment.dislikesCount--;
                                            }
                                        }

                                        this.comment.action = null;
                                    }
                                }
                            })

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
