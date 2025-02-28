import {Component, OnInit} from '@angular/core';
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'pop-up',
  standalone: false,
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpComponent implements OnInit {
  isShown:boolean = false;
  constructor(public popupService: PopupService) {
  }
  ngOnInit() {
    this.popupService.isShown$.subscribe((isShown:boolean)=>{
      this.isShown = isShown;
    });
  }
}
