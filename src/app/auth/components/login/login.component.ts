import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {catchError, throwError} from "rxjs";
import Swal from "sweetalert2";
import {LoginDTO} from "../../dto/LoginDTO";

@Component({
    selector: "app-login", templateUrl: "./login.component.html", styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
    public show: boolean = false;
    public loginForm: FormGroup;
    public errorMessage: any;

    constructor(
        public authService:AuthService,
        private fb: FormBuilder,
        public router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ["admin", [Validators.required]],
            password: ["Password@123", Validators.required],
        });
    }

    ngOnInit() {}

    showPassword() {
        this.show = !this.show;
    }

    login() {
        if (this.loginForm.valid){
            let loginDTO = new LoginDTO();
            loginDTO.username = this.loginForm.value["email"];
            loginDTO.password = this.loginForm.value["password"];
            this.authService.login(loginDTO).pipe(
                catchError((err) => {
                    Swal.fire('Unauthorized', 'Username or Password Wrong', 'error');
                    return throwError(err);
                })).subscribe(
                (response:any)=>{
                    console.log(response);
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("username", JSON.stringify(loginDTO.username));
                    this.router.navigate(["/dashboard/default"]);

                }
            );
        }
    }
}
