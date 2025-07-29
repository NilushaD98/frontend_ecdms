import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit {
  public userName: string;
  public profileImg: "assets/images/dashboard/profile.jpg";
  public user:string | null = '';
  notAdmin: boolean = false;

  constructor(public router: Router) {
    this.user = localStorage.getItem('user_type');
    if(this.user == 'PARENT' ||  this.user == 'TEACHER'){
      this.notAdmin = true;
    }
  }

  logoutFunc() {
    localStorage.clear();
    localStorage.removeItem("user");
    this.router.navigate(["/authentication/login"]);
  }
  ngOnInit(): void {}

    navigateProfile() {
        let user = localStorage.getItem('user_type');
        if(user == 'PARENT'){
          this.router.navigate(["/profile/student"]);
        }else if (user == 'TEACHER'){
          this.router.navigate(["/profile/teacher"]);
        }
    }
}
