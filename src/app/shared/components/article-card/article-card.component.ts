import {Component, Input} from '@angular/core';
import {PopularArticlesResponseType} from "../../../../types/popular-articles-response.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'article-card',
  standalone: false,
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss'
})
export class ArticleCardComponent {
  @Input()article!:PopularArticlesResponseType;
  serverStaticPath = environment.serverStaticPath;
}
