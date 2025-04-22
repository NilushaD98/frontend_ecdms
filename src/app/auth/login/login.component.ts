import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public show: boolean = false;
  public loginForm: FormGroup;
  public errorMessage: any;

  constructor(private fb: FormBuilder, public router: Router) {
    this.loginForm = this.fb.group({
      email: ["Test@gmail.com", [Validators.required, Validators.email]],
      password: ["test123", Validators.required],
    });
  }

  ngOnInit() {}

  showPassword() {
    this.show = !this.show;
  }

  // Simple Login
  login() {
    sessionStorage.setItem('plantId','1')
    sessionStorage.setItem('compId','1')
    sessionStorage.setItem('compAddress','1D Nalapaha, Divulapitiya, Sri Lanka')
    sessionStorage.setItem('compFullName','Sanmik Food (PVT) Ltd')
    sessionStorage.setItem('buyer_countries','0,')
    sessionStorage.setItem('user','Sanmik%20IT')
    sessionStorage.setItem('compName','SAN')
    sessionStorage.setItem('plantCode','DIV')
    sessionStorage.setItem('logger','admin')
    sessionStorage.setItem('auth_depo','true')
    sessionStorage.setItem('auth_dbn','true')
    sessionStorage.setItem('auth_crn','true')
    sessionStorage.setItem('auth_recipt','true')
    sessionStorage.setItem('auth_pay','true')
    sessionStorage.setItem('auth_bill','true')
    sessionStorage.setItem('auth_jou','true')
    if (this.loginForm.value["email"] == "Test@gmail.com" && this.loginForm.value["password"] == "test123") {
      let user = {
        email: "Test@gmail.com",
        password: "test123",
        name: "test user",
      };
      localStorage.setItem("user", JSON.stringify(user));
      this.router.navigate(["/dashboard/default"]);
    }
  }
}
