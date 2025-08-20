import {Component, QueryList, ViewChildren} from '@angular/core';
import {NoticeService} from "../../service/notice-service/notice.service";
import {NgbdSortableHeader, SortEvent} from "../../../shared/directive/sortable.directive";
import {Observable, throwError} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError} from "rxjs/operators";
import Swal from "sweetalert2";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserServiceService} from "../../service/user-service/user-service.service";
import {AddSpecialNoticeDTO} from "../../dto/AddSpecialNoticeDTO";

@Component({
  selector: 'app-special-notice',
  templateUrl: './special-notice.component.html',
  styleUrl: './special-notice.component.scss'
})
export class SpecialNoticeComponent {
  files: File[] = [];
  basicTable$: Observable<any>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  message: any;
  uploadedImageUrl: any;
  uploading = false;
  // Cloudinary config
  private cloudName = 'dsc7devgs';
  private uploadPreset = 'ecdmstemplate';
  users: any;
  selectedUsers: any [] = [];

  constructor(
      public service:NoticeService,
      public modalService:NgbModal,
      private http: HttpClient,
      public userService:UserServiceService
  ) {
    this.fetchData();
    userService.getAllStudents().subscribe(
        (res:any) =>{
          console.log(res)
          this.users = res.data;
        }
    );
  }

  fetchData(){
    this.service.getAllNotices().subscribe(
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

  openModal(getContent: any,item:any) {
    this.modalService.open(getContent, { size: 'lg' });
    this.message = item.message;
    this.uploadedImageUrl = item.mediaLink;
    this.selectedUsers = item.userList;

  }

  removeSpecialNotice(item: any) {

  this.service.removeSpecialNotice(item.specialNoticeID).pipe(
      catchError(err => {
        Swal.fire('Error', 'Failed to remove notice.', 'error');
        return throwError(err);
      })
  ).subscribe((res:any) => {
    if (res.success) {
      Swal.fire('Success', 'Notice deleted successfully.', 'success');
    }
  });
    
  }

  openAddSpecialNotice(getContent2: any) {
    this.modalService.open(getContent2,{ size: 'lg' });

  }

  onSelect(event: any) {
    const file = event.addedFiles[0];

    // Clear previous file
    this.files = [file];

    // Start upload immediately
    this.uploadToCloudinary(file);
  }

  uploadToCloudinary(file: File) {
    this.uploading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset); // e.g., 'ecdmstemplate'

    // 🔥 No headers = no Authorization sent
    const httpOptions = {
      headers: new HttpHeaders({}), // <-- Critical
    };

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;

    this.http.post(uploadUrl, formData, httpOptions)
        .pipe(
            catchError(err => {
              console.error('Upload to Cloudinary failed', err);
              Swal.fire('Error', 'Failed to upload file to Cloudinary.', 'error');
              this.uploading = false;
              return throwError(() => err);
            })
        )
        .subscribe({
          next: (response: any) => {
            Swal.fire('Success', 'File uploaded successfully.', 'success');
            this.uploadedImageUrl = response.secure_url;
            console.log(this.uploadedImageUrl)
            this.uploading = false;
          }
        });
  }
  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
    // Optionally: cancel upload or delete from Cloudinary (requires backend)
  }

  addSpecialNotice() {
    const addSpecialNoticeDTO = new AddSpecialNoticeDTO()
    addSpecialNoticeDTO.message = this.message;
    addSpecialNoticeDTO.mediaLink = this.uploadedImageUrl;
    addSpecialNoticeDTO.userList = this.selectedUsers;

    this.service.addSpecialNotice(addSpecialNoticeDTO).pipe(
        catchError(err => {
            console.log(err)
          Swal.fire('Error', 'Notice add unsuccessful.', 'error');
          return throwError(err);
        })
    ).subscribe(
        (res:any) =>{
          if (res.success) {
            Swal.fire('Success', 'Notice added successfully.', 'success');
            this.modalService.dismissAll();
            this.fetchData();
            this.message = '';
            this.selectedUsers = [];
            this.uploadedImageUrl = '';
            this.files = [];
          }
        }
    );

  }


}
