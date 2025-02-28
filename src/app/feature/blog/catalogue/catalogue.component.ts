import {Component} from '@angular/core';

@Component({
    selector: 'app-catalogue',
    standalone: false,
    templateUrl: './catalogue.component.html',
    styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent {
    sortingBlockOpen: boolean = false;
    toggleSortingBlock() {
        this.sortingBlockOpen = !this.sortingBlockOpen;
    }

}
