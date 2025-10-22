import {Component, QueryList, ViewChildren} from '@angular/core';
import {TablesService} from "../../../shared/services/tables/tables.service";
import {DecimalPipe} from "@angular/common";
import {Observable} from "rxjs";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directive/sortable.directive";
import {AttendanceService} from "../../service/attendence-service/attendance.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AttendanceMarkDTO, AttendanceRequestDTO} from "../../dto/AttendanceRequestDTO";

@Component({
  selector: 'app-attendance-teacher',
  providers: [TablesService, DecimalPipe],
  templateUrl: './attendance-teacher.component.html',
  styleUrl: './attendance-teacher.component.scss'
})
export class AttendanceTeacherComponent {

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
    this.fetchAllTeacherAttendance(new Date());

    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + today.getDate()).slice(-2);
    this.todayDate = `${year}-${month}-${day}`;

  }
  fetchAllTeacherAttendance(date:Date){
    this.selectedDate = date;
    let attendanceRequestDTO:AttendanceRequestDTO = new AttendanceRequestDTO(date,0);
    this.attendanceService.getAttendanceByDateTeacher(attendanceRequestDTO).subscribe(
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

  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);
    this.selectedDate=selectedDate;
    if (event.target.value && !isNaN(selectedDate.getTime())) {
      this.fetchAllTeacherAttendance(selectedDate);
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
        '',
        null,
        item.attendanceID,
    );
    this.attendanceService.updateAttendanceStatusTeacher(attendance).subscribe(
        (res) => {
          console.log('Attendance updated successfully', res);
          this.toastr.success('Attendance updated successfully!', 'Success');
          this.fetchAllTeacherAttendance(this.selectedDate);
        },
        (error) => {
          console.error('Error updating attendance:', error);
          // Revert UI if needed
        }
    );
  }
}
