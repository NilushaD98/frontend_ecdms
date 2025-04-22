import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddStudentComponent} from "../student-management/add-student/add-student.component";
import {ProfileComponent} from "./profile/profile.component";
import {AddAnnouncementComponent} from "./add-announcement/add-announcement.component";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {DropzoneModule} from "ngx-dropzone-wrapper";



@NgModule({
  declarations: [AddAnnouncementComponent,ProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DropzoneModule
  ]
})
export class DigitalPortfolioModule { }
