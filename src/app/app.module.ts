import {APP_INITIALIZER, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "./shared/shared.module";
import {OverlayModule} from "@angular/cdk/overlay";
import {ButtonsComponent} from "./components/buttons/buttons.component";
import {LoginComponent} from "./auth/components/login/login.component";
// for HttpClient import:
import {LoadingBarHttpClientModule} from "@ngx-loading-bar/http-client";
// // for Router import:
import {LoadingBarRouterModule} from "@ngx-loading-bar/router";
// // for Core import:
import {LoadingBarModule} from "@ngx-loading-bar/core";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AdminGuard} from "./shared/guard/admin.guard";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {FlatpickrModule} from "angularx-flatpickr";

import {NgxMasonryModule} from "ngx-masonry";
import {NgxPermissionsModule, NgxPermissionsService} from "ngx-permissions";
import {AuthService} from "./auth/service/auth.service";
import {HttpService} from "./auth/service/interceptors/http.service";
import {DigitalPortfolioModule} from "./ecdms/digital-portfolio/digital-portfolio.module";
import {StudentManagementModule} from "./ecdms/student-management/student-management.module";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [AppComponent, ButtonsComponent, LoginComponent],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        RouterModule,
        SharedModule,
        OverlayModule,
        LoadingBarHttpClientModule,
        LoadingBarRouterModule,
        LoadingBarModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        ToastrModule.forRoot(),
        CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
        FlatpickrModule.forRoot(),
        DigitalPortfolioModule,
        StudentManagementModule,
        NgxMasonryModule,
        NgxPermissionsModule.forRoot()
    ],
    providers: [
        AdminGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpService,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
