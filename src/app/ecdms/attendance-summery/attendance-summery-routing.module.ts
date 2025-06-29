import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "../digital-portfolio/profile/profile.component";
import {AddAnnouncementComponent} from "../digital-portfolio/add-announcement/add-announcement.component";
import {AttendanceStudentComponent} from "./attendance-student/attendance-student.component";
import {AttendanceTeacherComponent} from "./attendance-teacher/attendance-teacher.component";
var routingAnimation = localStorage.getItem('animate')

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'student',
        component: AttendanceStudentComponent,
        data: { animation: [routingAnimation] }
      },
      {
        path: 'teacher',
        component: AttendanceTeacherComponent,
        data: { animation: [routingAnimation] }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceSummeryRoutingModule { }
