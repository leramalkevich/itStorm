import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {Location} from "@angular/common";

export const authForwardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const location = inject(Location);
  if (authService.getIsLoggedIn()) {
    location.back();
    return false;
  }
  return true;
};
