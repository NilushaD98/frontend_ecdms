import {Component, QueryList, ViewChildren} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directive/sortable.directive";
import {AcademicMilestoneService} from "../../service/academic-milestone-service/academic-milestone.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserServiceService} from "../../service/user-service/user-service.service";
import {ExamResultDTO} from "../../dto/AddResultDTO";
import {catchError} from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {

  basicTable$: Observable<any>;
  total$: Observable<number>;
  todayDate: string;
  selectedDate:any;
  editMode:boolean =false;
  testID:number = 0;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  selectedTest: any;
  tests: any;
  selectedUser: any;
  users: any;
  passScore: any;
  score: any;
  testType:any;
  maxScore: any;
  typeDisable:boolean;
    classrooms = [
        { id: 1, name: 'Montessori - PLAYGROUP' },
        { id: 2, name: 'Montessori - LKG' },
        { id: 3, name: 'Montessori - UKG'}
    ];
    selectedClass:any;
  constructor(
      public service: AcademicMilestoneService,
      public route:Router,
      public academicMilestoneService:AcademicMilestoneService,
      public activatedRoute: ActivatedRoute,
      private toastr: ToastrService,
      public modalService:NgbModal,
      public testService:AcademicMilestoneService,
      public userServiceService:UserServiceService

  ) {

    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + today.getDate()).slice(-2);
    this.todayDate = `${year}-${month}-${day}`;
    this.selectedDate =new Date();
    this.typeDisable = true;

    userServiceService.getAllStudents().subscribe(
        (res:any) =>{
          console.log(res)
          this.users = res.data;
        }
    );


  }
  fetchResults(){
    console.log(this.selectedTest)
    this.service.getTestTypeAllDetailsByID(this.selectedTest).subscribe(
        (res:any) =>{
          console.log(res)
          this.testType =res.data;
          console.log(this.testType)
          this.service.setTableData(this.testType.examResultDetailsDTOS);
          this.basicTable$ = this.service.basicTable$;
          this.total$ = this.service.total$;
        }
    );
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

  addResult() {

    const result = new ExamResultDTO(
        null,
        this.selectedUser,
        this.selectedTest,
        this.score,
        this.passScore,
        this.maxScore,
        this.score >= this.passScore
    );
    this.service.addExamResult(result).pipe(
        catchError(err => {
          Swal.fire('Error', 'Failed to add result.', 'error');
          return throwError(err);
        })
    ).subscribe((res:any) => {
      if (res.success) {
        Swal.fire('Success', 'Result added successfully.', 'success');
        this.score = '';
        this.selectedUser = null;
        this.fetchResults();
      }
    });
  }

  removeResult(item: any) {

    this.service.removeResult(item.resultID).pipe(
        catchError(err => {
          Swal.fire('Error', 'Failed to remove result.', 'error');
          return throwError(err);
        })
    ).subscribe((res:any) => {
      if (res.success) {
        Swal.fire('Success', 'Result deleted successfully.', 'success');
        this.score = '';
        this.selectedUser = null;
        this.fetchResults();
      }
    });
  }

    fetchTests() {
      this.selectedTest = null;
        this.testService.getAllTestTypes(this.selectedClass).subscribe(
            (res:any) =>{
                this.tests = res.data;
                this.typeDisable = false;
                this.service.setTableData([]);
            }
        );
    }
}
