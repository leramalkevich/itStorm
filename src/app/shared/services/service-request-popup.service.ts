import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ServiceRequestPopupService {
    show$ = new Subject<boolean>();
    successfulRequest$ = new Subject<boolean>();
    selectedValue$ = new Subject<string>();
    constructor(private http:HttpClient) {}
    show() {
        this.show$.next(true);
    }
    hide() {
        this.show$.next(false);
        this.successfulRequest$.next(false);
    }
    getRequestForServices(name:string, phone:string,service:string, type:string):Observable<DefaultResponseType>{
        return this.http.post<DefaultResponseType>(environment.api+'requests',{
            name, phone, service, type
        });
    }
}
