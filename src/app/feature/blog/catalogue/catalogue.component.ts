import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {ArticlesResponseType} from "../../../../types/articles-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {debounceTime} from "rxjs";
import {ActiveParamsUtils} from "../../../shared/utils/active-params.utils";
import {CategoriesResponseType} from "../../../../types/categories-response.type";
import {ArticleService} from "../../../shared/services/article.service";

@Component({
    selector: 'app-catalogue',
    standalone: false,
    templateUrl: './catalogue.component.html',
    styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent implements OnInit, OnDestroy {
    private _snackBar = inject(MatSnackBar);
    sortingBlockOpen: boolean = false;
    sortingOptions: { id: string, name: string, url: string, active?: boolean }[] = [];
    articles: ArticlesResponseType | null = null;
    pages: number[] = [];
    categories: CategoriesResponseType[] = [];
    activeParams: ActiveParamsType = {categories: []};
    appliedFilters: { name: string, url: string }[] = [];

    constructor(private articleService: ArticleService, private activatedRoute: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.articleService.getArticlesCategories()
            .subscribe({
                next: (data: CategoriesResponseType[]) => {
                    if (data) {
                        this.sortingOptions = data as CategoriesResponseType[];
                    }
                }, error: (errorResponse: HttpErrorResponse) => {
                    if (errorResponse.error && errorResponse.error.message) {
                        this._snackBar.open(errorResponse.error.message);
                    } else {
                        this._snackBar.open('Что-то пошло не так...Обратитесь в тех поддержку');
                    }
                }
            });

        this.articleService.getArticles()
            .subscribe({
                next: (data: ArticlesResponseType) => {
                    if ((data as ArticlesResponseType).count === 0) {
                        this._snackBar.open('Упс..по Вашему запросу ничего не удалось найти');
                    }

                    this.articles = (data as ArticlesResponseType);
                    for (let i = 1; i <= (data as ArticlesResponseType).pages; i++) {
                        this.pages.push(i);
                    }

                    this.activatedRoute.queryParams
                        .pipe(
                            debounceTime(300)
                        )
                        .subscribe(params => {
                            this.activeParams = ActiveParamsUtils.processParams(params);
                            if (this.activeParams.page) {
                                this.activeParams.page = parseInt(String(this.activeParams.page));
                            } else {
                                this.activeParams.page = 1;
                            }

                            this.appliedFilters = [];
                            this.activeParams.categories?.forEach(url => {
                                for (let i = 0; i < this.sortingOptions.length; i++) {
                                    const foundType = [this.sortingOptions[i]].find(item => item.url === url);
                                    if (foundType) {
                                        this.appliedFilters.push({
                                            name: foundType.name,
                                            url: foundType.url
                                        });
                                        foundType.active = true;
                                    }
                                }
                            });
                            this.articleService.getArticlesWithCategories(this.activeParams)
                                .subscribe(data => {
                                    this.pages = [];
                                    for (let i = 1; i <= data.pages; i++) {
                                        this.pages.push(i);
                                    }
                                    this.articles = data;
                                });
                        });

                }, error: (errorResponse: HttpErrorResponse) => {
                    if (errorResponse.error && errorResponse.error.message) {
                        this._snackBar.open(errorResponse.error.message);
                    } else {
                        this._snackBar.open('Что-то пошло не так...Обратитесь в тех поддержку');
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.sortingOptions.forEach(item => {
            if (item.active === true) {
                item.active = false;
            }
        });
    }

    toggleSortingBlock(): void {
        this.sortingBlockOpen = !this.sortingBlockOpen;
    }

    openPage(page: number): void {
        this.activeParams.page = page;
        this.router.navigate(['/catalogue-of-articles'], {
            queryParams: this.activeParams
        });
    }

    openPrevPage(): void {
        if (this.activeParams.page && this.activeParams.page > 1) {
            this.activeParams.page--;
            this.router.navigate(['/catalogue-of-articles'], {
                queryParams: this.activeParams
            });
        }
    }

    openNextPage(): void {
        if (this.activeParams.page && this.activeParams.page < this.pages.length) {
            this.activeParams.page++;
            this.router.navigate(['/catalogue-of-articles'], {
                queryParams: this.activeParams
            });
        }
    }

    sort(value: string) {
        const hasBeenAdded: string | undefined = this.activeParams.categories?.find(item => item === value);
        if (hasBeenAdded) {
            this.activeParams.categories = this.activeParams.categories?.filter(item => item !== value);
            const removeFromAdded = this.sortingOptions.find(item => item.url === hasBeenAdded);
            if (removeFromAdded) {
                removeFromAdded.active = false;
                if (this.activeParams.page && this.activeParams.page > 1) {
                    this.activeParams.page = 1;
                }
                this.router.navigate(['/catalogue-of-articles'], {
                    queryParams: this.activeParams
                });
                return;
            }
        }
        const addingToActive = this.sortingOptions.find(item => item.url === value);
        if (addingToActive) {
            addingToActive.active = true;
        }
        if (this.activeParams.page && this.activeParams.page > 1) {
            this.activeParams.page = 1;
        }
        this.activeParams.categories?.push(value);
        this.router.navigate(['/catalogue-of-articles'], {
            queryParams: this.activeParams
        });
    }

    removeFilter(filter: { name: string, url: string }): void {
        this.activeParams.categories = this.activeParams.categories?.filter(item => item !== filter.url);
        const removingFromActive = this.sortingOptions.find(item => item.url === filter.url);
        if (removingFromActive) {
            removingFromActive.active = false;
        }
        this.activeParams.page = 1;
        this.router.navigate(['/catalogue-of-articles'], {
            queryParams: this.activeParams
        });
    }

    // отслеживание клика вне блока и скрытие его
    @HostListener('document:click', ['$event'])
    click(event: Event) {
        if (this.sortingBlockOpen && (event.target as HTMLElement).className.indexOf('blog-soring-block') === -1) {
            this.sortingBlockOpen = false;
        }
    }

}
