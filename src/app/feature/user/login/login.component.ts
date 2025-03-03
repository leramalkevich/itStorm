import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private _snackBar = inject(MatSnackBar);
    loginForm = this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required]],
        rememberMe: [false, []]
    });
    @ViewChild('password') password!: ElementRef;

    constructor(private authService: AuthService, private router: Router) {
    }

    login(): void {
        if (this.loginForm.value.email && this.loginForm.value.password) {
            this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
                .subscribe({
                    next: (data: LoginResponseType | DefaultResponseType) => {
                        let error = null;
                        if ((data as DefaultResponseType).error !== undefined) {
                            error = (data as DefaultResponseType).message;
                        }
                        const loginResponse = data as LoginResponseType;
                        if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
                            error = 'Ошибка авторизации';
                        }
                        if (error) {
                            this._snackBar.open(error);
                            throw new Error(error);
                        }

                        //   setting tokens
                        this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
                        this.authService.userId = loginResponse.userId;

                        this._snackBar.open('Вы успешно авторизировались');
                        this.router.navigate(['/']);

                    }, error: (errorResponse: HttpErrorResponse) => {
                        if (errorResponse.error && errorResponse.error.message) {
                            this._snackBar.open(errorResponse.error.message);
                        } else {
                            this._snackBar.open('Ошибка авторизации');
                        }
                    }
                });
        }
    }

    togglePassword() {
        if (this.password.nativeElement.getAttribute('type')=='password') {
            this.password.nativeElement.setAttribute('type', 'text');
        } else {
            this.password.nativeElement.setAttribute('type', 'password');
        }
    }

}
