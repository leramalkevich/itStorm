import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import {CatalogueComponent} from "./catalogue/catalogue.component";
import {ArticleComponent} from "./article/article.component";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
      CatalogueComponent,
      ArticleComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        BlogRoutingModule
    ]
})
export class BlogModule { }
