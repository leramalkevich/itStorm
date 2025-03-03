import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './components/services/services.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";

@NgModule({
    declarations: [
        ServicesComponent,
        ArticleCardComponent,
        PopUpComponent
    ],
    exports: [
        ServicesComponent,
        ArticleCardComponent,
        PopUpComponent
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        RouterLink,
    ]
})
export class SharedModule { }
