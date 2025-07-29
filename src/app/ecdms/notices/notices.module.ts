import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpecialNoticeComponent} from "./special-notice/special-notice.component";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TablesModule} from "../../components/tables/tables.module";
import {NgxDropzoneModule} from "ngx-dropzone";
import {NgSelectModule} from "@ng-select/ng-select";



@NgModule({
  declarations: [SpecialNoticeComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TablesModule,
        NgxDropzoneModule,
        NgSelectModule
    ]
})
export class NoticesModule { }
