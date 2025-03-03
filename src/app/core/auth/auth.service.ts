import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {LoginResponseType} from "../../../types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public accessTokenKey: string = 'accessToken';
    public refreshTokenKey: string = 'refreshToken';
    public userIdKey: string = 'userId';
    public isLogged$: Subject<boolean> = new Subject<boolean>();
    public isLogged: boolean = false;

    constructor(private http: HttpClient) {
    }

    login(email: string, password: string, rememberMe: boolean): Observable<LoginResponseType | DefaultResponseType> {
        return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'login', {
            email, password, rememberMe
        });
    }

    signup(name: string, email: string, password: string): Observable<LoginResponseType | DefaultResponseType> {
        return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'signup', {
            name, email, password
        });
    }

    refresh():Observable<DefaultResponseType|LoginResponseType>{
        const tokens = this.getTokens();
        if (tokens && tokens.refreshToken) {
            return this.http.post<DefaultResponseType|LoginResponseType>(environment.api+'refresh', {
                refreshToken: tokens.refreshToken
            });
        }
        throw throwError(()=>'Can not use token');
    }

    logout(): Observable<DefaultResponseType> {
        const tokens = this.getTokens();
        if (tokens && tokens.refreshToken) {
            return this.http.post<DefaultResponseType>(environment.api + 'logout', {
                refreshToken: tokens.refreshToken
            });
        }
        return throwError(() => 'Can not find token');
    }

    public setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        this.isLogged = true;
        this.isLogged$.next(true);
    }

    public removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        this.isLogged = false;
        this.isLogged$.next(false);
    }

    public getTokens(): { accessToken: string | null, refreshToken: string | null } {
        return {
            accessToken: localStorage.getItem(this.accessTokenKey),
            refreshToken: localStorage.getItem(this.refreshTokenKey),
        }
    }

    get userId(): null | string {
        return localStorage.getItem(this.userIdKey);
    }

    set userId(id: string | null) {
        if (id) {
            localStorage.setItem(this.userIdKey, id);
        } else {
            localStorage.removeItem(this.userIdKey);
        }
    }
    public getIsLoggedIn() {
        return this.isLogged;
    }
}
