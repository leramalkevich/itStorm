import {Component, inject, OnInit} from '@angular/core';
import {PopupService} from "../../services/popup.service";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'pop-up',
    standalone: false,
    templateUrl: './pop-up.component.html',
    styleUrl: './pop-up.component.scss'
})
export class PopUpComponent implements OnInit {
    private fb = inject(FormBuilder);
    private _snackBar = inject(MatSnackBar);
    isShown: boolean = false;
    successfulRequest:boolean=false;
    callBackForm = this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/^[А-Яа-я]+\s*$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^((\+7|7|8)+([0-9]){10})\s*$/)]],
        type: ['consultation']
    });

    constructor(public popupService: PopupService) {
    }

    ngOnInit() {
        this.popupService.isShown$.subscribe((isShown: boolean) => {
            this.isShown = isShown;
            this.callBackForm.get('name')?.markAsUntouched();
            this.callBackForm.get('name')?.reset();
            this.callBackForm.get('phone')?.markAsUntouched();
            this.callBackForm.get('phone')?.reset();
        });
    }

    numbersOnly(event:KeyboardEvent):void{
        let allowedToEnter = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete', '+'];
        if(allowedToEnter.includes(event.key) || event.key?.match(/\d+$/g)) {
            return;
        } else {
            event.preventDefault();
        }
    }

    orderConsultation(): void {
        if (this.callBackForm.value.name && this.callBackForm.value.phone && this.callBackForm.value.type) {
            this.popupService.getRequestForConsultation(this.callBackForm.value.name, this.callBackForm.value.phone, this.callBackForm.value.type)
                .subscribe({
                    next: (data: DefaultResponseType) => {
                        if (data.error === true) {
                            this._snackBar.open(data.message);
                            throw new Error(data.message);
                        } else {
                            this.successfulRequest = true;
                            this.popupService.successfulRequest$.subscribe((request:boolean)=>{
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
