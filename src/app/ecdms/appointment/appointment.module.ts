import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {AppointmentComponent} from "./appointment/appointment.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TablesModule} from "../../components/tables/tables.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {AppointmentRequestsComponent} from "./appointment-requests/appointment-requests.component";



@NgModule({
  declarations: [AppointmentComponent,AppointmentRequestsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TablesModule,
    NgSelectModule,
  ]
})
export class AppointmentModule { }
