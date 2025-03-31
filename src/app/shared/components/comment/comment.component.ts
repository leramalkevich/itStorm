import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
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
    @Output() userReactionChanged: EventEmitter<any> = new EventEmitter<any>();
    @Input() amountOfCommentsShown: number = 0;
    isLogged: boolean = false;
    @Input() countLikes: number = 0;
    @Input() countDislikes: number = 0;

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
                        this.commentsService.getUserArticleCommentActions(this.articleId)
                            .subscribe({
                                next: (data: DefaultResponseType | { comment: string, action: string }[]) => {
                                    if ((data as { comment: string, action: string }[]).length > 0) {
                                        const updateUserReaction = (data as { comment: string, action: string }[]).find(item => item.comment === this.comment.id);
                                        if (updateUserReaction) {
                                            this.comment.action = updateUserReaction.action;
                                        } else {
                                            delete this.comment.action;
                                        }
                                    }
                                }
                            });
                        this.userReactionChanged.emit(this.comment);

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
