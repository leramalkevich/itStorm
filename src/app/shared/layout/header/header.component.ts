import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  isLogged:boolean = false;
  constructor(private authService:AuthService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit():void {
    this.authService.isLogged$.subscribe((isLoggedIn:boolean)=>{
      this.isLogged = isLoggedIn;
    });
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
