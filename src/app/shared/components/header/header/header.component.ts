import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/shared/services/layout/layout.service';
import { NavService } from 'src/app/shared/services/nav.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public dark: boolean = this.layout.config.settings.layout_version == 'dark-only' ? true : false;

  collapseSidebar: boolean = true;
  compFullName: any;
  plantName: any;
  VERSION_NO: any;
  public user:string | null = '';

  constructor(private navServices: NavService, public layout: LayoutService) {
    this.user = localStorage.getItem('user_type');

  }

  sidebarToggle( ) {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  layoutToggle() {
    this.dark = !this.dark;
    this.layout.config.settings.layout_version = this.dark ? 'dark-only' : 'light';
  }

  searchToggle(){
    this.navServices.search = true;
  }

  ngOnInit(): void {
    this.compFullName = sessionStorage.getItem('compFullName');
    this.plantName = sessionStorage.getItem('plantName');
    this.VERSION_NO = sessionStorage.getItem('version');
  }
 
  
}
