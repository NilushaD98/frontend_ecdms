import { Component } from '@angular/core';
import {UserServiceService} from "../../service/user-service/user-service.service";
import {TeacherService} from "../../service/TeacherService/teacher.service";

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrl: './teacher-profile.component.scss'
})
export class TeacherProfileComponent {
  user: any;


  constructor(
      public userService:UserServiceService,
      public teacherService:TeacherService) {
    const userIdStr = localStorage.getItem('user_id');
    const userType = localStorage.getItem('user_type');
    const userId: number | null = userIdStr ? +userIdStr : null;

    this.teacherService.getTeacherById(userId).subscribe(
        (res:any) =>{
          console.log(res.data)
          this.user = res.data
        }
    )
  }
}
