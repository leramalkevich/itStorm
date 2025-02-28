import { Component } from '@angular/core';
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private popupService:PopupService) {
  }

  showPopup() {
    this.popupService.show();
  }

}
