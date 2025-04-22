import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentManagementRoutingModule } from './student-management-routing.module';
import {ManageTeacherComponent} from "./manage-teacher/manage-teacher.component";
import {ManageStudentComponent} from "./manage-student/manage-student.component";
import {AddTeacherComponent} from "./add-teacher/add-teacher.component";
import {AddStudentComponent} from "./add-student/add-student.component";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TablesModule} from "../../components/tables/tables.module";


@NgModule({
  declarations: [ManageTeacherComponent,ManageStudentComponent,AddTeacherComponent,AddStudentComponent],
    imports: [
        CommonModule,
        StudentManagementRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TablesModule
    ]
})
export class StudentManagementModule { }
