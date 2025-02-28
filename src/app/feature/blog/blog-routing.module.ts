import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CatalogueComponent} from "./catalogue/catalogue.component";
import {ArticleComponent} from "./article/article.component";

const routes: Routes = [
  {path:'catalogue-of-articles', component: CatalogueComponent},
  {path:'article', component: ArticleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
