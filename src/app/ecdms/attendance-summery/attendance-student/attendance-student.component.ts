import {Component, QueryList, ViewChildren} from '@angular/core';
import {async, Observable} from "rxjs";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directive/sortable.directive";
import {UserServiceService} from "../../service/user-service/user-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {SharedModule} from "../../../shared/shared.module";
import {TablesModule} from "../../../components/tables/tables.module";
import {DatePipe, DecimalPipe, NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AttendanceService} from "../../service/attendence-service/attendance.service";
import {TablesService} from "../../../shared/services/tables/tables.service";
import {AttendanceMarkDTO, AttendanceRequestDTO} from "../../dto/AttendanceRequestDTO";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-attendance-student',
  providers: [TablesService, DecimalPipe],
  templateUrl: './attendance-student.component.html',
  styleUrl: './attendance-student.component.scss'
})
export class AttendanceStudentComponent {

  basicTable$: Observable<any>;
  total$: Observable<number>;
  selectedDate:any;
  todayDate: string;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  selectedClass: any;


  programMapping:any = {
    ecd: 'ECD Center',
    dc: 'Daycare Center',
    ecddc: 'ECD & Daycare Center'
  };
  categoryMapping:any = {
    1: '2.5 - 3 years',
    2: '3 - 4 years',
    3: '4 - 5 years'
  };
  classrooms = [
    { id: 1, name: 'Play Class' },
    { id: 2, name: 'LKG Class' },
    { id: 3, name: 'UKG Class' },
    { id: 4, name: 'Day Care' },
  ];
  selectedClasses: number[]=[];
  constructor(
      public service: AttendanceService,
      public route:Router,
      public attendanceService:AttendanceService,
      public activatedRoute: ActivatedRoute,
      private toastr: ToastrService

  ) {
    const today = new Date();
    this.selectedDate = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + today.getDate()).slice(-2);
    this.todayDate = `${year}-${month}-${day}`;

  }
  fetchAllStudentsAttendance(date:Date,classType:number){
    this.selectedDate = date;
    let attendanceRequestDTO:AttendanceRequestDTO = new AttendanceRequestDTO(date,classType);
    this.attendanceService.getAttendanceByDate(attendanceRequestDTO).subscribe(
        (res:any) =>{
          console.log(res)
          this.attendanceService.setTableData(res.data);
          this.basicTable$ = this.attendanceService.basicTable$;
          this.total$ = this.attendanceService.total$;
        }
    );
  }

  // Method to get the display name
  getProgramDisplayName(programCode: string): string {
    return this.programMapping[programCode] || '';
  }
  getCategory(category: string): string {
    return this.categoryMapping[category] || '';
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


  searchAttendance() {

  }

  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);
    this.selectedDate=selectedDate;
    if (event.target.value && !isNaN(selectedDate.getTime())) {
      this.fetchAllStudentsAttendance(selectedDate,this.selectedClass);
    } else {
      // Optionally handle invalid date
      console.warn('Invalid date selected');
    }
  }

  toggleAttendance(item: any): void {
    // Toggle the local state immediately for a responsive UI
    const newStatus = !item.presentStatus;

    let type:string = '';
    if(this.selectedClass == 1 || this.selectedClass==2 || this.selectedClass==3 ){
      type = 'ecd'
    }else {
      type = 'day_care'
    }
    // Create the DTO with the new status
    const attendance = new AttendanceMarkDTO(
        this.selectedDate,
        newStatus,
        'Present',
        type,
        item.attendanceID,
        null
    );

    // Call the service to update attendance
    this.attendanceService.updateAttendanceStatus(attendance).subscribe(
        (res) => {
          console.log('Attendance updated successfully', res);
          // If the update is successful, update the local data model
          item.presentStatus = newStatus;
          this.toastr.success('Attendance updated successfully!', 'Success');
        },
        (error) => {
          console.error('Error updating attendance:', error);
          this.toastr.error('Failed to update attendance.', 'Error');
          // No need to revert UI if it wasn't toggled yet,
          // but if you want to show a failure state, you can do it here.
        }
    );
  }

  protected readonly HTMLInputElement = HTMLInputElement;

  fetchAttendance() {
    this.fetchAllStudentsAttendance(this.selectedDate,this.selectedClass);
  }
}
