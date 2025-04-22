import { Component, OnInit } from '@angular/core';
import { Options } from 'ngx-slider-v2';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  openSidebar: boolean = false
  value2: number = 100;
  maxValue: number = 70; 

  constructor() { }
  
  options: Options = {
    floor: 0,
    ceil: 200,
    getSelectionBarColor: (value: number): string => {
      return '#6362e7';
    },
    getPointerColor: (value: number): string => {
      return '#6362e7';
    }
  };

  ngOnInit(): void {
  }

  sidebarToggle(){
    this.openSidebar = !this.openSidebar    
  }

  
}
