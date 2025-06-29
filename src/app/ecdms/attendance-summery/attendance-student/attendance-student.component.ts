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
    { id: 1, name: 'Day Care' },
    { id: 2, name: 'Montessori' }
  ];
  selectedClasses: number[]=[];
  constructor(
      public service: AttendanceService,
      public route:Router,
      public attendanceService:AttendanceService,
      public activatedRoute: ActivatedRoute,
      private toastr: ToastrService

  ) {
    this.fetchAllStudentsAttendance(new Date());

    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + today.getDate()).slice(-2);
    this.todayDate = `${year}-${month}-${day}`;

  }
  fetchAllStudentsAttendance(date:Date){
    this.selectedDate = date;
    let attendanceRequestDTO:AttendanceRequestDTO = new AttendanceRequestDTO(date);
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
      this.fetchAllStudentsAttendance(selectedDate);
    } else {
      // Optionally handle invalid date
      console.warn('Invalid date selected');
    }
  }

  toggleAttendance(item: any): void {
    const attendance = new AttendanceMarkDTO(
        this.selectedDate,
        item.presentStatus,
        'Present',
        item.attendanceID,
        null
    );
    this.attendanceService.updateAttendanceStatus(attendance).subscribe(
        (res) => {
          console.log('Attendance updated successfully', res);
          this.toastr.success('Attendance updated successfully!', 'Success');
          this.fetchAllStudentsAttendance(this.selectedDate);
        },
        (error) => {
          console.error('Error updating attendance:', error);
          // Revert UI if needed
        }
    );
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
