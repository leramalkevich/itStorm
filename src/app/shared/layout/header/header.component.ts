import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserInfoResponseType} from "../../../../types/user-info-response.type";

@Component({
    selector: 'app-header',
    standalone: false,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    isLogged: boolean = false;
    userInfo: string | UserInfoResponseType | null = null;
    shownUserName: string | undefined;

    constructor(private authService: AuthService) {
        this.isLogged = this.authService.getIsLoggedIn();
        if (this.isLogged) {
            this.userInfo = this.authService.getUserInfo();
            this.shownUserName = (this.userInfo as UserInfoResponseType)?.name.trim().split(" ")[0];
        }
    }

    ngOnInit(): void {
        this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
            this.isLogged = isLoggedIn;
            if (isLoggedIn) {
                this.authService.userName$.subscribe(user => {
                    this.userInfo = user;
                    this.shownUserName = (this.userInfo as string)?.trim().split(" ")[0];
                });
            }
        });

    }

    logout(): void {
        this.authService.logout()
            .subscribe({
                next: () => {
                    this.doingLogout();
                },
                error: () => {
                    this.doingLogout();
                }
            });
    }

    doingLogout() {
        this.authService.removeTokens();
        this.authService.removeUserInfo();
        this._snackBar.open('Вы вышли из системы');
    }
}
