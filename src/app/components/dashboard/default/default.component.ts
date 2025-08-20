import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth/service/auth.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  
  constructor(public router: Router,) {
  }

  ngOnInit(): void {
    this.isAuthenticate();
  }

  isAuthenticate(){


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
