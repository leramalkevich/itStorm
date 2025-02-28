import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  isShown$ = new Subject<boolean>();
  constructor() { }

  show() {
    this.isShown$.next(true);
  }
  hide() {
    this.isShown$.next(false);
  }
}
