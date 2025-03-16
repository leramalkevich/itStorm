import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../services/user.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserInfoResponseType} from "../../../../types/user-info-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  isLogged:boolean = false;
  userInfo:UserInfoResponseType|undefined;
  constructor(private authService:AuthService, private userService:UserService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit():void {
    this.authService.isLogged$.subscribe((isLoggedIn:boolean)=>{
      this.isLogged = isLoggedIn;
      this.getUserInfo();
    });
  }

  getUserInfo():void{
    this.userService.getUserInfo()
        .subscribe({
          next:(data:DefaultResponseType|UserInfoResponseType)=>{
            if ((data as DefaultResponseType).error && (data as DefaultResponseType).message) {
              this._snackBar.open((data as DefaultResponseType).message);
            }
            this.userInfo = data as UserInfoResponseType;

          }, error:(errorResponse:HttpErrorResponse)=>{
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Что-то пошло не так...Обратитесь в тех поддержку');
            }
          }
        })
  }

  logout():void {
    this.authService.logout()
        .subscribe({
          next:()=>{
            this.doingLogout();
          },
          error:()=>{
            this.doingLogout();
          }
        });
  }

  doingLogout() {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
  }
}
