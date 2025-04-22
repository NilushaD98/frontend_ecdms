import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "../../../shared/components/breadcrumb/breadcrumb.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AddStudentDTO} from "../../dto/AddStudentDTO";
import {UserServiceService} from "../../service/user-service/user-service.service";
import {catchError} from "rxjs/operators";
import Swal from "sweetalert2";
import {throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.scss'
})
export class AddStudentComponent implements OnInit{

  form:FormGroup;
  parentForm:FormGroup;
  stuID:number = 0;
  constructor(public route:Router,public fb:FormBuilder,public userService:UserServiceService, public activatedRoute: ActivatedRoute,) {

  }

  ngOnInit(): void {
    this.initializeForm();
    this.activatedRoute.queryParams.subscribe((params:any) => {
      this.stuID = params['stuID'];
    });
    if(this.stuID != undefined){
      console.log(this.stuID);
      this.fetchStudent(this.stuID)
    }
  }

  fetchStudent(stuID:any){
    this.userService.getStudentByID(stuID).pipe().subscribe(
        (res:any)=>{

          this.form.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            fullName: res.data.fullName,
            dob: this.formatDateForInput(res.data.dob),
            gender: res.data.gender,
            address: res.data.address,
            program: res.data.program,
            ageCategory: res.data.ageCategory
          });
          this.parentForm.patchValue({
            fullNameParent: res.data.fullNameParent,
            relationship: res.data.relationship,
            email: res.data.email,
            contactOne: res.data.contactOne,
            contactTwo: res.data.contactTwo,
          })
        }
    );
  }
  private formatDateForInput(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  initializeForm(){
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      fullName: [''],
      dob: [''],
      gender: [''],
      address: [''],
      program:[''],
      ageCategory:['']
    });
    this.parentForm = this.fb.group({
      fullNameParent: [''],
      relationship: [''],
      email: [''],
      contactOne: [''],
      contactTwo: [''],
    });
  }
  addStudent() {
    if(!this.form.invalid && !this.parentForm.invalid){
      let student = new AddStudentDTO();
      student.firstName = this.form.get('firstName')?.value;
      student.lastName = this.form.get('lastName')?.value;
      student.fullName = this.form.get('fullName')?.value;
      student.dob = this.form.get('dob')?.value;
      student.gender = this.form.get('gender')?.value;
      student.address = this.form.get('address')?.value;
      student.program = this.form.get('program')?.value;
      student.ageCategory = this.form.get('ageCategory')?.value;

      student.fullNameParent = this.parentForm.get('fullNameParent')?.value;
      student.relationship = this.parentForm.get('relationship')?.value;
      student.email = this.parentForm.get('email')?.value;
      student.contactOne = this.parentForm.get('contactOne')?.value;
      student.contactTwo = this.parentForm.get('contactTwo')?.value;

      console.log(student)
      this.userService.addStudent(student).pipe(
          catchError(
              (err) =>{
                Swal.fire(
                    '500',
                    'Internal Server Error',
                    'error'
                );
                return throwError(err);
              }
          )
      ).subscribe(
          (res:any)=>{
            console.log(res)
            if(res.success){
              Swal.fire(
                  'Success',
                  'Student Added Successfully.',
                  'success'
              );
              this.form.reset();
              this.parentForm.reset();
              this.route.navigate(['/student-management/manage-student']);
            }else {
              Swal.fire(
                  'Error',
                  'Student Added Error occurred.',
                  'error'
              );
              return;
            }
          }
      );

    }
  }
}
