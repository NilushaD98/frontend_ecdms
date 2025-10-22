import {Component, QueryList, ViewChildren} from '@angular/core';
import {TablesService} from "../../../shared/services/tables/tables.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserServiceService} from "../../service/user-service/user-service.service";
import {Observable} from "rxjs";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directive/sortable.directive";
import {TeacherService} from "../../service/TeacherService/teacher.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-manage-teacher',
  templateUrl: './manage-teacher.component.html',
  styleUrl: './manage-teacher.component.scss'
})
export class ManageTeacherComponent {

  basicTable$: Observable<any>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  classrooms = [
    { id: 1, name: 'Day Care' },
    { id: 2, name: 'Montessori - PLAYGROUP' },
    { id: 3, name: 'Montessori - LKG' },
    { id: 4, name: 'Montessori - UKG'}
  ];
  constructor(
      public service: TeacherService  ,
      public route:Router,
      public teacherService:TeacherService,
      public activatedRoute: ActivatedRoute,

  ) {

  this.fetchAllTeachers();
  }
  fetchAllTeachers(){
    this.teacherService.getAllTeachers().subscribe(
        (res:any)=>{
          console.log(res)
          this.teacherService.setTableData(res.data);
          this.basicTable$ =  this.teacherService.basicTable$;
          this.total$ =  this.teacherService.total$;
        }
    )
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  navigateAddTeacher() {
    this.route.navigate(['/student-management/add-teacher']);
  }
  updateTeacher(teacherID:number){
    this.route.navigate(['/student-management/add-teacher'],{ queryParams: { teacherID: teacherID } });
  }
  getClassNames(classroomIds: number[]): (string | undefined)[] {
    return classroomIds
        .map(id => this.classrooms.find(c => c.id === id)?.name)
        .filter(name => name);
  }

  removeTeacher(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.teacherService.removeTeacher(id).subscribe(
            (res: any) => {
              if(res.success){
                Swal.fire('Deleted!', res.message, 'success');
              }else {
                Swal.fire('Unsuccessful!', "Error occurred in teacher remove.", 'error');
              }
              this.fetchAllTeachers();
            }
        );
      }
    });
  }
}
