import { Component } from '@angular/core';
import {ProfileService} from "../../service/profile-service/profile.service";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrl: './notices.component.scss'
})
export class NoticesComponent {

  post:any[];
  constructor(public ups:ProfileService) {

    this.fetchNotices()
  }

  fetchNotices(){
    const userID = localStorage.getItem('user_id');
    if (userID) { // Check if userID exists
      this.ups.getStudentFullDetailsByID(userID)  // Unsubscribe when component is destroyed
          .subscribe(
              (res:any) =>{
                this.post = res.data.allSpecialNoticeDTOList;
              }
          );
    }
  }
}
