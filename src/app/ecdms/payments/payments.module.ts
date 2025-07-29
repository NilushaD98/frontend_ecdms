import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaymentComponent} from "./payment/payment.component";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbHighlight, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {TablesModule} from "../../components/tables/tables.module";
import {PaymentsRoutingModule} from "./payments-routing.module";



@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbHighlight,
    NgbPagination,
    SharedModule,
    TablesModule,
      PaymentsRoutingModule
  ]
})
export class PaymentsModule { }
