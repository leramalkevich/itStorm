import {Component, OnInit} from '@angular/core';
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit{
  isShown:boolean = false;
  constructor(private loaderService:LoaderService) {
  }
  ngOnInit():void {
    this.loaderService.isShown$.subscribe((shown:boolean)=>{
      this.isShown = shown;
    });
  }
}
