import {Component, inject, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../../services/article.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RelatedArticlesType} from "../../../../types/related-articles.type";

@Component({
  selector: 'app-article',
  standalone: false,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit{
  private _snackBar = inject(MatSnackBar);
  article!:ArticleType;
  relatedArticles:RelatedArticlesType[]=[];
  serverStaticPath = environment.serverStaticPath;
  constructor(private articleService:ArticleService, private activatedRoute:ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params=>{
      this.articleService.getArticle(params['url'])
          .subscribe({
            next:(data:ArticleType)=>{
              this.article = data;
            }, error:(errorResponse:HttpErrorResponse)=>{
              if (errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
              } else {
                this._snackBar.open('Что-то пошло не так...Обратитесь в тех поддержку');
              }
            }
          })
      this.articleService.getRelatedArticles(params['url'])
          .subscribe({
            next:(data:RelatedArticlesType[])=>{
              if (data && data.length > 0) {
                this.relatedArticles = data
              }
            }, error:(errorResponse:HttpErrorResponse)=>{
              if (errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
              } else {
                this._snackBar.open('Что-то пошло не так...Обратитесь в тех поддержку');
              }
            }
          })
    });


  }

}
