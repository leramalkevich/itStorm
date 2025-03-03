import {Component, inject, OnInit} from '@angular/core';
import {ArticlesResponseType} from "../../../../types/articles-response.type";
import {ArticleService} from "../../../services/article.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-catalogue',
    standalone: false,
    templateUrl: './catalogue.component.html',
    styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    sortingBlockOpen: boolean = false;
    articles: ArticlesResponseType | null = null;

    constructor(private authService: ArticleService) {
    }

    ngOnInit() {
        this.authService.getArticles()
            .subscribe({
                next: (data: DefaultResponseType | ArticlesResponseType) => {
                    let error = null;
                    if ((data as DefaultResponseType).error !== undefined) {
                        error = (data as DefaultResponseType).message;
                    }
                    if (error) {
                        this._snackBar.open(error);
                        throw new Error(error);
                    }
                    this.articles = (data as ArticlesResponseType);
                    console.log(this.articles);

                }, error: (errorResponse: HttpErrorResponse) => {
                    if (errorResponse.error && errorResponse.error.message) {
                        this._snackBar.open(errorResponse.error.message);
                    } else {
                        this._snackBar.open('Ошибка. Позвоните нам либо закажите обратный звонок');
                    }
                }
            });

    }

    toggleSortingBlock() {
        this.sortingBlockOpen = !this.sortingBlockOpen;
    }

}
