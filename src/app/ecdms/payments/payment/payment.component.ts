import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {UserServiceService} from "../../service/user-service/user-service.service";
import {PaymentService} from "../../service/payment-service/payment.service";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directive/sortable.directive";
import {PaymentFilterDTO} from "../../dto/PaymentFilterDTO";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{

  basicTable$: Observable<any>;
  total$: Observable<number>;
  selectedUser: any;
  users: any;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  paymentType: any;
  amount: any;
  dueDateFormatted: string = '';
  paidDateFormatted: string = '';
  paidStatus: boolean= false;
  selectedItem:any;
  userType:any;

  constructor(
      public userServiceService:UserServiceService,
      public service:PaymentService,
      public modalService:NgbModal,
  ) {
      const userType = localStorage.getItem('user_type');
      const userId = localStorage.getItem('user_id');
      if(userType){
          this.userType = userType;
      }
    userServiceService.getAllStudents().subscribe(
        (res:any) =>{
          console.log(res)
          this.users = res.data;
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

  getPayments() {
      let paymentFilter = new PaymentFilterDTO(
          this.selectedUser,false,''
      );
      this.service.getPayments(paymentFilter).subscribe(
          (res:any) =>{
              this.service.setTableData(res.data);
              this.basicTable$ = this.service.basicTable$;
              this.total$ = this.service.total$;
          }
      )
  }

  viewPayment(item: any, getContent: any) {
      this.selectedItem =item;
      this.paidStatus = item.paid;
      this.modalService.open(getContent);
      this.paymentType = item.type;
      this.amount = item.amount
      const dateFormat = 'yyyy-MM-dd';
      const dateTimeFormat = 'yyyy-MM-dd h:mm a';

      // this.dueDateFormatted = this.datePipe.transform(item.dueDate, dateFormat) || '';
      // this.paidDateFormatted = item.paidDate
      //     ? this.datePipe.transform(item.paidDate, dateTimeFormat) || ''
      //     : 'Not Paid Yet';

      // payment.component.ts
      this.dueDateFormatted = this.formatDate(item.dueDate); // 2025-04-05
      this.paidDateFormatted  = this.formatDate(item.paidDate, true); // 2025-04-05 10:30
  }

  makePayment() {
   const paymentDTO = this.selectedItem;
   this.service.makePayment(paymentDTO).pipe(
       catchError(err => {
           Swal.fire('Error', 'Payment unsuccessful.', 'error');
           return throwError(err);
       })
   ).subscribe(
       (res:any) =>{
           if (res.success) {
               Swal.fire('Success', 'Payment added successfully.', 'success');
               this.getPayments();
               this.modalService.dismissAll();
           }
       }
   );
  }

    ngOnInit(): void {
    }


    formatDate(date: Date | string | null | undefined, includeTime: boolean = false): string {
        if (!date || date === null) return 'Not Paid Yet';

        const d = new Date(date);

        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2); // Months are 0-based
        const day = ('0' + d.getDate()).slice(-2);

        if (!includeTime) {
            return `${year}-${month}-${day}`;
        }

        const hours = ('0' + d.getHours()).slice(-2);
        const minutes = ('0' + d.getMinutes()).slice(-2);
        // const seconds = ('0' + d.getSeconds()).slice(-2); // optional

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}
