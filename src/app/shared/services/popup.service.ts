import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  isShown$ = new Subject<boolean>();
  successfulRequest$ = new Subject<boolean>();
  constructor(private http:HttpClient) { }

  show() {
    this.isShown$.next(true);
  }
  hide() {
    this.isShown$.next(false);
    this.successfulRequest$.next(false);
  }

  getRequestForConsultation(name:string, phone:string, type:string):Observable<DefaultResponseType>{
    return this.http.post<DefaultResponseType>(environment.api+'requests',{
      name, phone, type
    });
  }
}
