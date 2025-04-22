import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import {catchError, Observable, throwError} from "rxjs";
import {AuthService} from "../../auth/service/auth.service";
import Swal from "sweetalert2";
import {NgxPermissionsService, NgxRolesService} from "ngx-permissions";
import {DeviceDetectorService} from "ngx-device-detector";

@Injectable({
    providedIn: "root",
})
export class AdminGuard implements CanActivate {
    constructor(
        public route: Router,
        public permissionService: NgxPermissionsService,
        public roleService: NgxRolesService,
        public authService: AuthService,
        private deviceService: DeviceDetectorService
    ) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const browser = this.deviceService.browser;
        console.log('browser : ' + browser);

        if (browser !== 'Chrome') {
            this.route.navigate(['/error-page/error-page1']);
            return false;
        }

        console.log(state.url)
        if (state.url.search('authentication') > 0) {
            console.log('Authentication count : ' + state.url.search('authentication'));
            return true;
        }

        if (AuthService. isCredentialsValid()) {
            /*const role = localStorage.getItem('role');
            if (role === 'Epic_Admin') {
                this.route.navigate(['/doxpro-spaces/home']);
            } else {
                if (role) {
                    const roleArr = role.split('_');
                    if (roleArr) {
                        if (roleArr[1] === 'Admin') {
                            this.router.navigate(['/workflow/create-new-workflow']);
                        } else {
                            this.router.navigate(['/workflow/my-form']);
                        }
                    } else {
                        this.router.navigate(['/workflow/my-form']);
                    }
                }
            }*/
            return true;
        } else {
            // Swal.fire('Authorization','Token is not valid. Log Again!!!','error')
            this.route.navigate(['/error-page/error-page4']);
            return false;
        }

        if (this.authService.idUserLoggedIn()) {
            return true;
        } else {
            Swal.fire('Timed Out', 'Your Session Expired. Log Again!!!', 'error');
            this.route.navigate(['/error-page/error-page4']);
            return false;
        }
    }

    getLoginRolesAndPermission() {
        this.authService.whoAmI().pipe(
            catchError((err) => {
                Swal.fire('Timed Out', 'Your Session Expired. Log Again!!!', 'error');
                this.route.navigate(['authentication/login']);
                return throwError(err);
            })
        ).subscribe((response: any) => {
            if (response.code === 200) {
                const roleList: string[] = response.data.roles;
                const permissionList: string[] = response.data.privileges;
                this.permissionService.hasPermission(permissionList);
                this.permissionService.loadPermissions(['Local_Invoice']);
                console.log(this.permissionService.getPermissions())
                const roleObject = roleList.reduce((acc, role) => {
                    acc[role] = [role];
                    return acc;
                }, {} as { [key: string]: string[] });

                this.roleService.addRole('admin',['local_invoice,invoices,has permission']);
                console.log(this.permissionService.getPermissions());
                console.log(this.roleService.getRoles());
            } else {
                Swal.fire('Internal Server Error', 'Contact the System Administrator', 'error');
                this.route.navigate(['authentication/login']);
            }
        });
    }
}
