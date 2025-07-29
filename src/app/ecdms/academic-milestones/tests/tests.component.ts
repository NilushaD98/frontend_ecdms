import {Component, QueryList, ViewChildren} from '@angular/core';
import {async, Observable} from "rxjs";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directive/sortable.directive";
import {AttendanceService} from "../../service/attendence-service/attendance.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AttendanceRequestDTO} from "../../dto/AttendanceRequestDTO";
import {AcademicMilestoneService} from "../../service/academic-milestone-service/academic-milestone.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TablesService} from "../../../shared/services/tables/tables.service";
import {DecimalPipe} from "@angular/common";
import {TestTypeDTO} from "../../dto/TestTypeDTO";
import Swal from "sweetalert2";

@Component({
  selector: 'app-tests',
    providers: [TablesService, DecimalPipe],
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss'
})
export class TestsComponent {

  basicTable$: Observable<any>;
  total$: Observable<number>;
  todayDate: string;
  selectedDate:any;
  editMode:boolean =false;
  testID:number = 0;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
    testName: any;
    description: any;


  constructor(
      public service: AcademicMilestoneService,
      public route:Router,
      public academicMilestoneService:AcademicMilestoneService,
      public activatedRoute: ActivatedRoute,
      private toastr: ToastrService,
      public modalService:NgbModal

  ) {
    this.fetchAllTests();
      const today = new Date();
      const year = today.getFullYear();
      const month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based
      const day = ('0' + today.getDate()).slice(-2);
      this.todayDate = `${year}-${month}-${day}`;
      this.selectedDate =new Date();


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

  fetchAllTests(){
   this.service.getAllTestTypes().subscribe(
       (res:any) =>{
         this.service.setTableData(res.data);
         this.basicTable$ = this.service.basicTable$;
         this.total$ = this.service.total$;
       }
   );
  }

  navigateAddTest(getContent:any) {
      this.editMode = false;
      this.testName = '';
      this.description = '';
      const modalRef = this.modalService.open(getContent);

  }

  onDateChange(event: any) {
      const selectedDate = new Date(event.target.value);
      this.selectedDate=selectedDate;
      console.log(selectedDate)
  }

    addTestType() {
      if(this.editMode){
          this.updateTest();
      }else {
          let testTypeDTO= new TestTypeDTO(null,this.testName,this.description,this.selectedDate);

          this.service.addTestType(testTypeDTO).subscribe(
              (res:any) =>{
                  if(res.success){
                      Swal.fire(
                          'Success',
                          'Test type Added Successfully.',
                          'success'
                      );
                      this.modalService.dismissAll();
                      this.testName = '';
                      this.description = '';
                      this.fetchAllTests();
                  }else {
                      Swal.fire(
                          'Error',
                          'Test type Added Error occurred.',
                          'error'
                      );
                      return;
                  }
              }
          );
      }

    }

    viewTest(item: any,getContent:any) {
      this.editMode = true;
        const modalRef = this.modalService.open(getContent);
        this.service.getTestTypeByID(item.testTypeID).subscribe(
            (res:any)=>{
                this.testID = res.data.testTypeID;
                this.todayDate = new Date(res.data.testDate).toISOString().split('T')[0];
                this.testName = res.data.testName;
                this.description = res.data.description;
            }
        );
    }

    removeTest(item: any) {
        Swal.fire({
            title: 'Are you sure remove test?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.removeTestTypeByID(item.testTypeID).subscribe(
                    (res:any) =>{
                        if(res.success){
                            Swal.fire(
                                'Success',
                                'Test type Remove Successfully.',
                                'success'
                            );
                            this.modalService.dismissAll();
                            this.testName = '';
                            this.description = '';
                            this.fetchAllTests();
                        }else {
                            Swal.fire(
                                'Error',
                                'Test type Remove Error occurred.',
                                'error'
                            );
                            return;
                        }
                    }
                )
            }
        });
    }

    private handleModalClose() {
        this.editMode = false;
        this.testName = '';
        this.description = '';
        console.log("Modal closed - editMode set to false");
    }
    updateTest() {
      this.editMode = false;
        let testTypeDTO= new TestTypeDTO(this.testID,this.testName,this.description,this.selectedDate);

        this.service.updateTestType(testTypeDTO).subscribe(
            (res:any) =>{
                if(res.success){
                    Swal.fire(
                        'Success',
                        'Test type Updated Successfully.',
                        'success'
                    );
                    this.modalService.dismissAll();
                    this.testName = '';
                    this.description = '';
                    this.fetchAllTests();
                }else {
                    Swal.fire(
                        'Error',
                        'Test type Update Error occurred.',
                        'error'
                    );
                    return;
                }
            }
        );
    }
}
