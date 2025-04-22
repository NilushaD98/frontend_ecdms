import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamplePageRoutingModule } from './sample-page-routing.module';
import { SamplePageComponent } from './sample-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProductListDirective} from "../../shared/directive/product-list.directive";
import {TablesRoutingModule} from "../tables/tables-routing.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
    declarations: [
        SamplePageComponent,
        ProductListDirective,


    ],
    exports: [
        ProductListDirective
    ],
    imports: [
        CommonModule,
        SamplePageRoutingModule,
        SharedModule,
        FormsModule,
        TablesRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        HttpClientModule,
    ]
})
export class SamplePageModule { }
