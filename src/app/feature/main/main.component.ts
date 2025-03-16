import {Component, inject, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {DefaultResponseType} from "../../../types/default-response.type";
import {PopularArticlesResponseType} from "../../../types/popular-articles-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ServiceRequestPopupService} from "../../shared/services/service-request-popup.service";
import {ArticleService} from "../../shared/services/article.service";

@Component({
    selector: 'app-main',
    standalone: false,
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    public popularArticles:PopularArticlesResponseType[]=[];
    constructor(private articleService:ArticleService, private serviceRequestPopupService:ServiceRequestPopupService) {
    }
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        dots: true,
        navSpeed: 700,
        navText: ['', ''],
        autoplay: true,
        smartSpeed: 600,
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 1
            },
            740: {
                items: 1
            },
            940: {
                items: 1
            }
        },
        nav: true
    }

    customOptionsReviews: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        // margin:26,
        dots: false,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 3
            }
        },
        nav: false
    }

    reviews = [
        {
            name: 'Станислав',
            image: 'user1.png',
            text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
        },
        {
            name: 'Алёна',
            image: 'user2.png',
            text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
        },
        {
            name: 'Мария',
            image: 'user3.png',
            text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
        },
    ]

    ngOnInit():void {
        this.articleService.getPopularArticles()
            .subscribe({
                next: (data:DefaultResponseType|PopularArticlesResponseType[])=>{
                    let error = null;
                    if ((data as DefaultResponseType).error !== undefined) {
                        error = (data as DefaultResponseType).message;
                    }
                    if (error) {
                        this._snackBar.open(error);
                        throw new Error(error);
                    }
                    this.popularArticles = data as PopularArticlesResponseType[];
                },
                error:(errorResponse:HttpErrorResponse)=>{
                    if (errorResponse.error && errorResponse.error.message) {
                        this._snackBar.open(errorResponse.error.message);
                    } else {
                        this._snackBar.open('Ошибка. Позвоните нам либо закажите обратный звонок');
                    }
                }
            })
    }

    showRequestPopup():void{
        this.serviceRequestPopupService.show();
    }
}
