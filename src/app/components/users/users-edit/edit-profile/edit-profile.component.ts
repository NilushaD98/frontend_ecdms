import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {AuthService} from "../../../../auth/service/auth.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
    form: FormGroup;

  constructor(private fb: FormBuilder,public router: Router,private authService: AuthService) { }

  ngOnInit(): void {
    this.formInit();
    this.init();
  }

  init() {
        this.form.patchValue({
          disname : sessionStorage.getItem('logger'),
          comp : sessionStorage.getItem('compFullName'),
          dep : sessionStorage.getItem('department'),
          nic : sessionStorage.getItem('nic'),
        })
    }

  formInit(){
    this.form = this.fb.group({
      disname: [''],
      comp: [''],
      dep: [''],
      nic: [''],
      currentpwd: ['', Validators.required],
      newpwd1: ['', Validators.required],
      newpwd2: ['', Validators.required],
    });
  }

  updatePwd() {
    if (this.form.valid) {
      var pwd1 = this.form.value.newpwd1;
      var pwd2 = this.form.value.newpwd2;
      var userName = this.form.value.disname;
      var currentpwd = this.form.value.currentpwd;

      if (pwd1 != pwd2) {
        this.showmsg('The password that you typed do not match. Please retype the new password in both boxes.', false);
        return;
      }

      var conditionVal = this.checkStrength(pwd1);
      /*if (conditionVal != "Password is strong enough") {
        this.showmsg(conditionVal, false);
        return;
      }*/

      let all = {
        userName: userName,
        newpwd1: pwd1,
        currentpwd: currentpwd
      }
      this.authService.pwReset(all).subscribe(data => {
        if (data.message == "invalid") {
          this.showmsg('The password or username that you typed is incorrect. Please retype your current password and username.', false);
        } else if (data.message.startsWith("error")) {
          this.showmsg('Password changing error. Please contact system administrator', false);
        } else if (data.message == "success") {
          this.showmsg('Success.', true);
        } else {
          this.showmsg('Data Saving Error. Please contact system administrator', false);
        }
      }, error => {
        this.showmsg('Data Saving Error. Please contact system administrator', false);
      })
    }
  }

  showmsg(msg:any, done:any) {
    if (done == true) {
      Swal.fire({
        title: msg,
        text: "You have changed your password successfully, press \"OK\" to continue.",
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.value) {
          this.setLogout();
        }
      });
    } else {
      Swal.fire('error',msg,"error");
    }
  }

  setLogout() {
    this.router.navigate(["/authentication/login"]);
  }

  checkStrength(password:any) {
    var strength = 0;
    if (password.length < 6) {
//        $('#result').removeClass();
      Swal.fire('error','Password is too short (Use more than 5 characters)',"error");
      return;
    }
    if (password.length >= 6)
      strength += 1;
    // If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))
      strength += 1;
    // If it has numbers and characters, increase strength value.
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))
      strength += 1;
    // If it has one special character, increase strength value.
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))
      strength += 1;
    // If it has two special characters, increase strength value.
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/))
      strength += 1;
    // Calculated strength value, we can return messages
    // If value is less than 2
//    console.log(strength);
    if (strength < 2) {
//        $('#result').removeClass();
      Swal.fire('error','Password is weak (Mix Numbers & Characters)',"error");
    } else if (strength == 2) {
//        $('#result').removeClass();
      Swal.fire('error','Password is good but not strong (Mix Special Characters)',"error");
      return;
    } else {
//        $('#result').removeClass();
      Swal.fire('error','Password is strong enough',"error");
      return;
    }
  }
}
