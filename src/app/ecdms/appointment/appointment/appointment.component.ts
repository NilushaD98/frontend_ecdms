import {Component, OnInit} from '@angular/core';
import {ModalComponent} from "../../../components/ui-kits/modal/modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserServiceService} from "../../service/user-service/user-service.service";
import {AppointmentDTO} from "../../dto/AppointmentDTO";
import {AppointmentService} from "../../service/appointment-service/appointment.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent implements OnInit{
  reason: any;
  users:any;
  selectedUser: any;
  groupedAppointments: any;
  userId: any;
  userType:any = '';

  ngOnInit(){

  }
  constructor(
      public modalService:NgbModal,
      public userServiceService:UserServiceService,
      public appointmentService:AppointmentService,
      public router:Router
  ) {
      userServiceService.getAllStudents().subscribe(
          (res:any) =>{
              console.log(res)
              this.users = res.data;
          });
      const userType = localStorage.getItem('user_type');
      this.userId = localStorage.getItem('user_id')? localStorage.getItem('user_id') :'';
      if (userType) {
        this.userType = userType;
        if(userType == 'ADMIN'){
            appointmentService.getAppointmentDateVise().subscribe(
                (res:any) =>{
                    this.groupedAppointments = res.data;
                }
            )
        }else {
            appointmentService.getAppointmentDateViseAndUserVise(this.userId).subscribe(
                (res:any) =>{
                    this.groupedAppointments = res.data;
                }
            )
        }
      }



  }

  navigateAddAppointment(getContent: any) {
      const modalRef = this.modalService.open(getContent);
  }

  addAppointment() {
   const appointmentDTO = new AppointmentDTO(
       null,
       this.userType == 'ADMIN'?this.selectedUser:this.userId,
       null,
       this.reason,
       null,
       false
   );
    this.appointmentService.addAppointment(appointmentDTO).subscribe(
        (res:any) => {
            if (res.success){
                Swal.fire(
                    'Success',
                    'Appointment requested successfully.',
                    'success'
                );
                this.modalService.dismissAll();
            }
        },
        (error) => {
            console.error('Error request appointment', error);
            // Revert UI if needed
        }
    );
  }

    navigateRequestedAppointment() {
      this.router.navigate(['/appointment/appointment-requests']);
    }
}
