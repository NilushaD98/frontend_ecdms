import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../service/user-service/user-service.service';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {AddTeacherDTO} from "../../dto/AddTeacherDTO";
import {TeacherService} from "../../service/TeacherService/teacher.service";
import {SharedModule} from "../../../shared/shared.module";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, NgSelectModule, FormsModule]
})
export class AddTeacherComponent implements OnInit {
  form!: FormGroup;
  teacherID: number = 0;
  classrooms = [
    { id: 1, name: 'Day Care' },
    { id: 2, name: 'Montessori' }
  ];
  selectedClasses: number[]=[];

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private userService: TeacherService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.subscribe(params => {
      this.teacherID = params['teacherID'];
    });

    if (this.teacherID) {
      this.fetchTeacher(this.teacherID);
    }
  }

  initializeForm() {
    this.form = this.fb.group({
      fullName: [''],
      contact: [''],
      nic: [''],
      dob: [''],
      email: [''],
      gender: [''],
      salary: [0],
      joiningDate: [''],
      address: [''],
      classroomList: [[]]
    });
  }

  fetchTeacher(id: number) {
    this.userService.getTeacherById(id).subscribe((res: any) => {
      const teacher = res.data;
      this.teacherID = id;
      this.form.patchValue({
        fullName: teacher.fullName,
        contact: teacher.contact,
        nic: teacher.nic,
        dob: this.formatDateForInput(teacher.dob),
        email: teacher.email,
        gender: teacher.gender,
        salary: teacher.salary,
        joiningDate: this.formatDateForInput(teacher.joiningDate),
        address: teacher.address,
        classroomList: teacher.classroomList
      });
    });
  }

  private formatDateForInput(date: string | Date): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  saveTeacher() {
    if (this.form.invalid) return;

    const teacher = new AddTeacherDTO();
    teacher.fullName = this.form.get('fullName')?.value;
    teacher.contact = this.form.get('contact')?.value;
    teacher.nic = this.form.get('nic')?.value;
    teacher.dob = this.form.get('dob')?.value;
    teacher.email = this.form.get('email')?.value;
    teacher.gender = this.form.get('gender')?.value;
    teacher.salary = parseFloat(this.form.get('salary')?.value);
    teacher.joiningDate = this.form.get('joiningDate')?.value;
    teacher.address = this.form.get('address')?.value;
    teacher.classroomList = this.selectedClasses;
    console.log(this.selectedClasses)
    console.log(teacher)
    if (this.teacherID) {
      teacher.teacherID = this.teacherID;
      this.userService.updateTeacher(teacher).pipe(
          catchError(err => {
            Swal.fire('Error', 'Failed to update teacher.', 'error');
            return throwError(err);
          })
      ).subscribe((res:any) => {
        if (res.success) {
          Swal.fire('Success', 'Teacher updated successfully.', 'success');
          this.router.navigate(['/student-management/manage-teacher']);
        }
      });
    } else {
      this.userService.addTeacher(teacher).pipe(
          catchError(err => {
            Swal.fire('Error', 'Failed to add teacher.', 'error');
            return throwError(err);
          })
      ).subscribe((res:any) => {
        if (res.success) {
          Swal.fire('Success', 'Teacher added successfully.', 'success');
          this.resetForm();
          this.router.navigate(['/student-management/manage-teacher']);
        }
      });
    }
  }

  resetForm() {
    this.form.reset();
    this.form.patchValue({
      classroomList: []
    });
  }
}