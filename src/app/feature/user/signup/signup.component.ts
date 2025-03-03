import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-signup',
    standalone: false,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    private fb = inject(FormBuilder);
    private _snackBar = inject(MatSnackBar);
    signupForm = this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/^[А-Яа-я]+\s*$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
        agree: [false, [Validators.requiredTrue]]
    });
    @ViewChild('password')password!:ElementRef;

    constructor(private authService: AuthService, private router: Router) {
    }

    signup() {
        if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password) {
            this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
                .subscribe({
                    next: (data: LoginResponseType | DefaultResponseType) => {
                        let error = null;
                        if ((data as DefaultResponseType).error !== undefined) {
                            error = (data as DefaultResponseType).message;
                        }
                        const loginResponse = data as LoginResponseType;
                        if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
                            error = 'Ошибка при регистрации';
                        }
                        if (error) {
                            this._snackBar.open(error);
                            throw new Error(error);
                        }

                        //   setting tokens and informing about success
                        this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
                        this.authService.userId = loginResponse.userId;
                        this._snackBar.open('Вы успешно зарегистрировались');
                        this.router.navigate(['/']);

                    }, error: (errorResponse: HttpErrorResponse) => {
                        if (errorResponse.error && errorResponse.error.message) {
                            this._snackBar.open(errorResponse.error.message);
                        } else {
                            this._snackBar.open('Ошибка при регистрации');
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
