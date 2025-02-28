import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import {CatalogueComponent} from "./catalogue/catalogue.component";
import {ArticleComponent} from "./article/article.component";


@NgModule({
  declarations: [
      CatalogueComponent,
      ArticleComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
