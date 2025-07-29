import {RouterModule, Routes} from "@angular/router";import {NgModule} from "@angular/core";
import {PaymentComponent} from "./payment/payment.component";
var routingAnimation = localStorage.getItem('animate')
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'payment',
                component: PaymentComponent,
                data: { animation: [routingAnimation] }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentsRoutingModule { }
