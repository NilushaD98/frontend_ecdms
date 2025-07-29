import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppointmentComponent} from "./appointment/appointment.component";
import {AppointmentRequestsComponent} from "./appointment-requests/appointment-requests.component";
var routingAnimation = localStorage.getItem('animate')

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'appointment',
        component: AppointmentComponent,
        data: { animation: [routingAnimation] }
      },
      {
        path: 'appointment-requests',
        component: AppointmentRequestsComponent,
        data: { animation: [routingAnimation] }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
