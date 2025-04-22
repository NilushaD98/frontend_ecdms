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

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrl: './add-announcement.component.scss'
})
export class AddAnnouncementComponent {
  uploadedImageUrl: string;
  public html = '';
  selectedCity: any;
  selectedCityIds: string[];
  selectedCityName = 'Vilnius';
  selectedCityId: number;
  selectedUserIds: number[];
  files: File[] = []
  public category = [{ id: 1, name: "Life Style" }, { id: 2, name: "Travel" }];
  public selectedCategory: string[] = [];

  cities2 = [
    { id: 1, name: 'Vilnius' },
    { id: 2, name: 'Kaunas' },
    { id: 3, name: 'Pavilnys', disabled: true },
    { id: 4, name: 'Pabradė' },
    { id: 5, name: 'Klaipėda' }
  ];
  cities4: { id: number; name: string; }[];

  public text = '<i class="icon-cloud-up"></i><h6>Drop files here or click to upload.</h6><span class="dz-message">(Upload files directly to Cloudinary)</span>';
  public config: DropzoneConfigInterface;

  private cloudinary: Cloudinary;
  caption: any;
  private dropzoneInstance: any;

  constructor(public announcementService:AnnouncementService) {
    this.cloudinary = new Cloudinary({
      cloud: {
        cloudName: 'dsc7devgs' // Replace with your Cloudinary cloud name
      }
    });
    // Configure Dropzone to use Cloudinary
    this.config = {
      url: `https://api.cloudinary.com/v1_1/dsc7devgs/upload`,
      maxFilesize: 50,
      acceptedFiles: 'image/*',
      addRemoveLinks: true,
      maxFiles:2,
      headers: { },
      params: {
        upload_preset: 'ecdmstemplate' // Replace with your Cloudinary upload preset
      },
    };
  }

  ngOnInit(): void {}

  onUploadError(args: any): void {
    console.error('Upload Error:', args);
  }

  onUploadSuccess(args: any): void {
    const [file, response] = args;
    console.log('Upload Success:', response);
    this.uploadedImageUrl = args[1]?.secure_url;
    // Access the uploaded file URL from Cloudinary
    // Access the uploaded file URL from Clouaddinary
    const uploadedImageUrl = response.secure_url;
    console.log('Uploaded Image URL:', uploadedImageUrl);
  }


  post() {
    if(this.uploadedImageUrl || this.caption){
      let addAnnouncementDTO = new AnnouncementDTO();
      addAnnouncementDTO.announcementID = 0
      addAnnouncementDTO.pictureLink = this.uploadedImageUrl;
      addAnnouncementDTO.caption = this.caption;
      this.announcementService.addAnnouncement(addAnnouncementDTO).pipe(
          catchError(
              (err) =>{
                Swal.fire(
                    '500',
                    'Internal Server Error',
                    'error'
                );
                return throwError(err);
              }
          )
      ).subscribe(
          (res:any)=>{
            console.log(res)
            if(res.announcementID >0){
              Swal.fire(
                  'Success',
                  'Post Uploded Successfully',
                  'success'
              );
              this.caption = '';
              this.uploadedImageUrl = '';
            }else {
              Swal.fire(
                  '500',
                  'Internal Server Error',
                  'error'
              );
            }
          }
      );
    }else {
      Swal.fire(
          'Error',
          'You cannot post empty post',
          'error'
      );
    }
  }
}
