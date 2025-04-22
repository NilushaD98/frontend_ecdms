import { NgModule } from "@angular/core";
var routingAnimation = localStorage.getItem("animate");
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/components/login/login.component";
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { content } from "./shared/routes/routes/routers";
import { AdminGuard } from "./shared/guard/admin.guard";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full";
import {NgxPermissionsGuard, ngxPermissionsGuard} from "ngx-permissions";
import {DefaultComponent} from "./components/dashboard/default/default.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "authentication/login",
    pathMatch: "full",
    // component:DefaultComponent,
    // canActivate:[AdminGuard,NgxPermissionsGuard]
  },
  {
    path: "authentication/login",
    component: LoginComponent,
  },
  {
    path: "",
    component: ContentComponent,
    children: content,
  },
  {
    path: "",
    component: FullComponent,
    children: full,
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: "enabled",
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
