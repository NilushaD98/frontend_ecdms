import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StudentProfileComponent} from "./student-profile/student-profile.component";
import {TeacherProfileComponent} from "./teacher-profile/teacher-profile.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {CalendarModule} from "angular-calendar";
import {ResultsComponent} from "./results/results.component";
import {PaymentsComponent} from "./payments/payments.component";
import {NoticesComponent} from "./notices/notices.component";
import {AttendanceComponent} from "./attendance/attendance.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxDropzoneModule} from "ngx-dropzone";

@NgModule({
  declarations: [StudentProfileComponent,TeacherProfileComponent,ResultsComponent,PaymentsComponent,NoticesComponent,AttendanceComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        CalendarModule,
        NgSelectModule,
        FormsModule,
        NgxDropzoneModule
    ]
})
export class UserProfileModule { }
