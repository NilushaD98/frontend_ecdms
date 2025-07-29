import {Component, QueryList, ViewChildren} from '@angular/core';
import {Observable} from "rxjs";
import {AppointmentService} from "../../service/appointment-service/appointment.service";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directive/sortable.directive";
import {TablesService} from "../../../shared/services/tables/tables.service";
import {DecimalPipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppointmentDTO} from "../../dto/AppointmentDTO";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: 'app-appointment-requests',
  providers: [TablesService, DecimalPipe],
  templateUrl: './appointment-requests.component.html',
  styleUrl: './appointment-requests.component.scss'
})
export class AppointmentRequestsComponent {

  basicTable$: Observable<any>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  selectedUser: any;
  reason: any;
  selectedItem:any;
  selectedDate:any;

  constructor(
      public service:AppointmentService,
      public modalService:NgbModal,
      public toaster:ToastrService
  ) {
    this.fetchAppointment();
  }


  fetchAppointment(){
    this.service.getPendingAppointment().subscribe(
        (res:any) =>{
          this.service.setTableData(res.data);
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

  viewAppointment(item: any, getContent: any) {
    this.selectedItem = item;
    this.modalService.open(getContent);
    this.selectedUser = item.studentName;
    this.reason = item.reason;
  }

  assignDate(event: any) {
    const selectedDate = new Date(event.target.value);
    this.selectedDate = selectedDate;
  }

  approveAppointment() {
    const appointmentDTO = new AppointmentDTO(
        this.selectedItem.appointmentId,
        this.selectedItem.studentID,
        null,
        null,
        this.selectedDate,
        true
    );
    this.service.approveAppointment(appointmentDTO).subscribe(
        (res:any) => {
          if (res.success) {
            Swal.fire(
                'Success',
                'Appointment Approves Successfully.',
                'success'
            );
            this.modalService.dismissAll();
            this.fetchAppointment();

          }else {
            Swal.fire(
                'Error',
                'Appointment Approves Unsuccessfully.',
                'error'
            );
          }
        }
    );
  }
}
