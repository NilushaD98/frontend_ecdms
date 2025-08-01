import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnInit, OnDestroy
import { CalendarEvent } from "angular-calendar";
import {Subject, takeUntil, throwError} from "rxjs"; // Import takeUntil
import { addMonths, subMonths } from "date-fns";
import { ProfileService } from "../../service/profile-service/profile.service";
import { NoticesRequestDTO } from "../../dto/AddSpecialNoticeDTO"; // Make sure path is correct
import { NoticeService } from "../../service/notice-service/notice.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UpdateStudentDTO} from "../../dto/UpdateStudentDTO";
import {catchError} from "rxjs/operators";
import Swal from "sweetalert2";

// Define interface for processed notice data
interface DisplayNotice {
  specialNoticeID: number;
  message: string;
  // Sanitized/truncated media link for display
  displayMediaLink: string | null;
  // Original media link
  originalMediaLink: string | null;
}

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'] // Corrected to styleUrls
})
export class StudentProfileComponent implements OnInit, OnDestroy { // Implement OnInit, OnDestroy
  studentName: any = '';
  unreadCount: number = 1;
  fullName: any = "nilusha";

  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  user: any;
  userType:any;

  // For Notices
  notices: DisplayNotice[] = [];
  isNoticesModalOpen: boolean = false;
  loadingNotices: boolean = false;
  noticeError: string | null = null;

  // For unsubscription
  private destroy$ = new Subject<void>();

  constructor(
      public ups: ProfileService,
      public noticeService: NoticeService,
      public modalService:NgbModal
  ) {
    this.openNoticesModal();
  }

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('user_id');
    const userType = localStorage.getItem('user_type');
    const userId: number | null = userIdStr ? +userIdStr : null;

    if (userId) {
      this.fetchStudentData(userId);
      this.fetchSpecialNotices(userId);
    } else {
      console.error('User ID not found in localStorage');
      // Handle missing user ID, maybe redirect
    }

    this.userType = userType;
  }

  fetchStudentData(userId: number): void {
    this.ups.getStudentFullDetailsByID(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            console.log('Student Data:', res.data);
            this.user = res.data;
            // You can populate studentName/fullName from res.data if needed
          },
          error: (err) => {
            console.error('Error fetching student data:', err);
            // Handle error
          }
        });
  }

  fetchSpecialNotices(userId: number): void {
    this.loadingNotices = true;
    this.noticeError = null;

    const noticesRequestDTO = new NoticesRequestDTO(userId, false); // Fetch unread notices? Adjust logic if needed

    this.noticeService.getSpecialNoticeUserVise(noticesRequestDTO)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            console.log('Special Notices Raw Data:', res);
            // Check if response structure is as expected
            if (res && Array.isArray(res.data)) {
              // Process notices: sanitize/truncate media links
              this.notices = res.data.map((notice: any) => {
                let displayLink: string | null = null;
                let originalLink: string | null = null;
                if (notice.mediaLink && typeof notice.mediaLink === 'string') {
                  originalLink = notice.mediaLink.trim();
                  // Basic sanitization: remove trailing spaces (your data seems to have them)
                  displayLink = originalLink;
                  // You could add more logic here if needed (e.g., truncating long URLs for display names)
                }
                return {
                  specialNoticeID: notice.specialNoticeID,
                  message: notice.message || '', // Ensure message is a string
                  displayMediaLink: displayLink,
                  originalMediaLink: originalLink
                };
              });
              console.log('Processed Notices:', this.notices);
            } else {
              console.warn('Unexpected notices response structure:', res);
              this.notices = [];
            }
            this.loadingNotices = false;
          },
          error: (err) => {
            console.error('Error fetching special notices:', err);
            this.noticeError = 'Failed to load notices.';
            this.notices = [];
            this.loadingNotices = false;
          }
        });
  }

  openNoticesModal(): void {
    this.isNoticesModalOpen = true;
    // Optional: Mark notices as read here or when modal closes
    // You would call a service method like markNoticesAsRead()
  }

  closeNoticesModal(): void {
    this.isNoticesModalOpen = false;
  }

  // Optional: Function to mark notices as read (call service)
  // markNoticesAsRead(): void {
  //   // Implement logic to mark notices as read via NoticeService
  //   // This might involve sending a list of IDs or updating a status
  // }
  allergies: any;
  specialNotice: any;
  contactOne: any;
  contactTwo: any;

  nextMonth() {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  previousMonth() {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editUser() {
    let updateStudentDTO:UpdateStudentDTO = new UpdateStudentDTO();
    const userIdStr = localStorage.getItem('user_id');
    const userId: number | null = userIdStr ? +userIdStr : null;
    updateStudentDTO.userID = userId;
    updateStudentDTO.allergies = this.allergies;
    updateStudentDTO.specialNotice = this.specialNotice;
    updateStudentDTO.contactOne = this.contactOne;
    updateStudentDTO.contactTwo = this.contactTwo;
    this.noticeService.updateUser(updateStudentDTO).pipe(
        catchError(err => {
          Swal.fire('Error', 'Update unsuccessful.', 'error');
          return throwError(err);
        })
    ).subscribe(
        (res:any) =>{
          if (res.success) {
            Swal.fire('Success', 'User updated successfully.', 'success');
            this.modalService.dismissAll();
            if(userId){
              this.fetchStudentData(userId);
            }
          }
        }
    );
  }

  openEditModal(getContent: any) {
    this.modalService.open(getContent,{size: 'lg'});
    this.allergies = this.user.allergies;
    this.specialNotice = this.user.specialNotice;
    this.contactOne = this.user.contact1;
    this.contactTwo = this.user.contactTwo;
  }
}