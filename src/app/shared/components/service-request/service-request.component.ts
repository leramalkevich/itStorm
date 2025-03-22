import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ServiceRequestPopupService} from "../../services/service-request-popup.service";

@Component({
    selector: 'app-service-request',
    standalone: false,
    templateUrl: './service-request.component.html',
    styleUrl: './service-request.component.scss'
})
export class ServiceRequestComponent implements OnInit {
    private fb = inject(FormBuilder);
    private _snackBar = inject(MatSnackBar);
    isShown: boolean = false;
    successfulRequest: boolean = false;
    chosenService: string = '';
    services: { id: number, value: string, title: string }[] = [
        {id: 1, value: 'Создание сайтов', title: 'Создание сайтов'},
        {id: 2, value: 'Продвижение', title: 'Продвижение'},
        {id: 3, value: 'Реклама', title: 'Реклама'},
        {id: 4, value: 'Копирайтинг', title: 'Копирайтинг'},
    ]
    callBackForm = this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/^[А-Яа-я]+\s*$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^((\+7|7|8)+([0-9]){10})\s*$/)]],
        service: [this.chosenService, [Validators.required]],
        type: ['order']
    });

    constructor(public serviceRequestPopupService: ServiceRequestPopupService) {
    }

    ngOnInit(): void {
        this.serviceRequestPopupService.show$.subscribe((isShown: boolean) => {
            this.isShown = isShown;
            this.callBackForm.get('name')?.reset();
            this.callBackForm.get('name')?.markAsUntouched();
            this.callBackForm.get('phone')?.reset();
            this.callBackForm.get('phone')?.markAsUntouched();
        });
        this.serviceRequestPopupService.selectedValue$.subscribe((title: string) => {
            this.chosenService = title;
        });
    }

    numbersOnly(event: KeyboardEvent): void {
        let allowedToEnter = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete', '+'];
        if (allowedToEnter.includes(event.key) || event.key?.match(/\d+$/g)) {
            return;
        } else {
            event.preventDefault();
        }
    }

    makeRequest(): void {
        if (this.callBackForm.value.name && this.callBackForm.value.phone && this.callBackForm.value.service && this.callBackForm.value.type) {
            this.serviceRequestPopupService.getRequestForServices(this.callBackForm.value.name, this.callBackForm.value.phone,
                this.callBackForm.value.service, this.callBackForm.value.type)
                .subscribe({
                    next: (data: DefaultResponseType) => {
                        if (data.error === true) {
                            this._snackBar.open(data.message);
                            throw new Error(data.message);
                        } else {
                            this.successfulRequest = true;
                            this.serviceRequestPopupService.successfulRequest$.subscribe((request: boolean) => {
                                this.successfulRequest = request;
                                this.callBackForm.get('name')?.reset();
                                this.callBackForm.get('name')?.markAsUntouched();
                                this.callBackForm.get('phone')?.reset();
                                this.callBackForm.get('phone')?.markAsUntouched();
                            });
                        }
                    }, error: (errorResponse: HttpErrorResponse) => {
                        if (errorResponse.error && errorResponse.error.message) {
                            this._snackBar.open(errorResponse.error.message);
                        } else {
                            this._snackBar.open('Ошибка. Что-то пошло не так...');
                        }
                    }
                });
        }
    }
}
