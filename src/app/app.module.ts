import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './shared/layout/layout.component';
import {HeaderComponent} from './shared/layout/header/header.component';
import {FooterComponent} from './shared/layout/footer/footer.component';
import {MainComponent} from './feature/main/main.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CarouselModule} from "ngx-owl-carousel-o";
import {SharedModule} from "./shared/shared.module";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MatMenuModule} from "@angular/material/menu";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {AuthInterceptor} from "./core/auth/auth.interceptor";

@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        HeaderComponent,
        FooterComponent,
        MainComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        // RouterModule,
        BrowserAnimationsModule,
        CarouselModule,
        SharedModule,
        MatSnackBarModule,
        MatMenuModule,
        AppRoutingModule,
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue:{duration: 3000, horizontalPosition: 'center', verticalPosition: 'top'}},
        {provide:HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
