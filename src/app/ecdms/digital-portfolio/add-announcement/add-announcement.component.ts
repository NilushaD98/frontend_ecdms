import { Component } from '@angular/core';
import {DropzoneConfigInterface, DropzoneModule} from "ngx-dropzone-wrapper";
import {Cloudinary, CloudinaryImage} from "@cloudinary/url-gen";
import {BreadcrumbComponent} from "../../../shared/components/breadcrumb/breadcrumb.component";
import {FormsModule} from "@angular/forms";
import {AnnouncementService} from "../../service/announcement.service";
import {AnnouncementDTO} from "../../dto/AnnouncementDTO";
import Swal from "sweetalert2";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrl: './add-announcement.component.scss'
})
export class AddAnnouncementComponent {
  files: File[] = [];
  uploadedImageUrl: string;
  uploading = false;
  caption: string = '';
  classrooms = [
    { id: 1, name: 'Day Care' },
    { id: 2, name: 'Montessori - PLAYGROUP' },
    { id: 3, name: 'Montessori - LKG' },
    { id: 4, name: 'Montessori - UKG'}
  ];
  selectedClasses: number[]=[];

  // Cloudinary config
  private cloudName = 'dsc7devgs';
  private uploadPreset = 'ecdmstemplate';

  constructor(
      private http: HttpClient,
      public announcementService: AnnouncementService
  ) {}

  // Called when file is selected
  onSelect(event: any) {
    const file = event.addedFiles[0];

    // Clear previous file
    this.files = [file];

    // Start upload immediately
    this.uploadToCloudinary(file);
  }

  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
    // Optionally: cancel upload or delete from Cloudinary (requires backend)
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
            this.uploading = false;
          }
        });
  }

  post() {
    if (!this.caption && !this.uploadedImageUrl) {
      Swal.fire('Error', 'You cannot post an empty post', 'error');
      return;
    }

    const addAnnouncementDTO = new AnnouncementDTO();
    addAnnouncementDTO.announcementID = 0;
    addAnnouncementDTO.pictureLink = this.uploadedImageUrl;
    addAnnouncementDTO.caption = this.caption;
    addAnnouncementDTO.classroomList = this.selectedClasses;

    this.announcementService.addAnnouncement(addAnnouncementDTO)
        .pipe(
            catchError(err => {
              Swal.fire('Error', 'Internal Server Error', 'error');
              return throwError(() => err);
            })
        )
        .subscribe({
          next: (res: any) => {
            if (res?.announcementID > 0) {
              Swal.fire('Success', 'Post Uploaded Successfully', 'success');
              this.resetForm();
            } else {
              Swal.fire('Error', 'Failed to save post', 'error');
            }
          }
        });
  }

  resetForm() {
    this.caption = '';
    this.files = [];
    this.uploadedImageUrl = '';
  }
}
