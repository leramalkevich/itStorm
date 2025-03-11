import {Component, OnInit} from '@angular/core';
import {ServiceRequestPopupService} from "../../services/service-request-popup.service";
import {ServiceType} from "../../../../types/service.type";

@Component({
    selector: 'servicesBlock',
    standalone: false,
    templateUrl: './services.component.html',
    styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
    services = [
        {
            id: 1,
            image: 'service1.png',
            title: 'Создание сайтов',
            description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
            price: '7 500₽'
        },
        {
            id: 2,
            image: 'service2.png',
            title: 'Продвижение',
            description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
            price: '3 500₽'
        },
        {
            id: 3,
            image: 'service3.png',
            title: 'Реклама',
            description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
            price: '1 000₽'
        },
        {
            id: 4,
            image: 'service4.png',
            title: 'Копирайтинг',
            description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
            price: '750₽'
        },
    ]

    constructor(private serviceRequestPopupService: ServiceRequestPopupService) {
    }

    ngOnInit(): void {
    }

    showRequestPopup(selectedService:ServiceType): void {
        this.serviceRequestPopupService.show();
        this.serviceRequestPopupService.selectedValue$.next(selectedService.title);
    }


}
