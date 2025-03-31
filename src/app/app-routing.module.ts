import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./feature/main/main.component";
import {authForwardGuard} from "./core/auth/auth-forward.guard";
import {authGuard} from "./core/auth/auth.guard";

const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: [
        {path: '', component: MainComponent},
        {path: '', loadChildren: () => import('./feature/user/user.module').then(m => m.UserModule), canActivate:[authForwardGuard]},
        {path: '', loadChildren: () => import('./feature/blog/blog.module').then(m => m.BlogModule)}
        // {path: '', loadChildren: () => import('./feature/blog/blog.module').then(m => m.BlogModule), canActivate:[authGuard]}
    ]
}];

@NgModule({
    imports: [RouterModule.forRoot(routes, {anchorScrolling: "enabled", scrollPositionRestoration:"enabled"})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
