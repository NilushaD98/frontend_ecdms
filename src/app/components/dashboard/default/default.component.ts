import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth/service/auth.service";
import Swal from "sweetalert2";
import {DeviceDetectorService} from "ngx-device-detector";
import {Router} from "@angular/router";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  
  constructor(private deviceService: DeviceDetectorService,public router: Router,) {
  }

  ngOnInit(): void {
    this.isAuthenticate();
  }

  isAuthenticate(){
    const browser = this.deviceService.browser;
    console.log('browser : ' + browser);

    if (browser !== 'Chrome') {
      this.router.navigate(['/error-page/error-page1']);
      return false;
    }

    console.log(AuthService. isCredentialsValid())
    if (AuthService. isCredentialsValid()) {
      this.router.navigate(["/dashboard/default"]);
      return true;
    } else {
      // Swal.fire('Authorization','Token is not valid. Log Again!!!','error')
      this.router.navigate(['/error-page/error-page4']);
      return false;
    }

  }

}
