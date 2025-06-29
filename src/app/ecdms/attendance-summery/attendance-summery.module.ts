import { NgModule } from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';

import { AttendanceSummeryRoutingModule } from './attendance-summery-routing.module';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TablesModule} from "../../components/tables/tables.module";
import {AttendanceStudentComponent} from "./attendance-student/attendance-student.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {AttendanceTeacherComponent} from "./attendance-teacher/attendance-teacher.component";


@NgModule({
  declarations: [AttendanceStudentComponent,AttendanceTeacherComponent],
    imports: [
        CommonModule,
        AttendanceSummeryRoutingModule,
        SharedModule,
        FormsModule,
        TablesModule,
        ReactiveFormsModule,
        NgSelectModule,

    ]
})
export class AttendanceSummeryModule { }
