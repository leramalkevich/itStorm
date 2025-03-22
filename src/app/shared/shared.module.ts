import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './components/services/services.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";
import { LoaderComponent } from './components/loader/loader.component';
import { ServiceRequestComponent } from './components/service-request/service-request.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import { CommentComponent } from './components/comment/comment.component';
import { SliceTextPipe } from './pipes/slice-text.pipe';

@NgModule({
    declarations: [
        ServicesComponent,
        ArticleCardComponent,
        PopUpComponent,
        LoaderComponent,
        ServiceRequestComponent,
        CommentComponent,
        SliceTextPipe
    ],
    exports: [
        ServicesComponent,
        ArticleCardComponent,
        PopUpComponent,
        LoaderComponent,
        ServiceRequestComponent,
        CommentComponent
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        RouterLink,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule
    ]
})
export class SharedModule { }
