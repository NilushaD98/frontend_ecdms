import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddStudentComponent} from "../student-management/add-student/add-student.component";
import {ProfileComponent} from "./profile/profile.component";
import {AddAnnouncementComponent} from "./add-announcement/add-announcement.component";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {DropzoneModule} from "ngx-dropzone-wrapper";
import {NgxDropzoneModule} from "ngx-dropzone";



@NgModule({
  declarations: [AddAnnouncementComponent,ProfileComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DropzoneModule,
        NgxDropzoneModule
    ]
})
export class DigitalPortfolioModule { }
