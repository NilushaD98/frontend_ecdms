import { Component } from '@angular/core';
import {Subject} from "rxjs";
import {ProfileService} from "../../service/profile-service/profile.service";
import {DatePipe, DecimalPipe} from "@angular/common";
import {takeUntil} from "rxjs/operators";
import {TablesService} from "../../../shared/services/tables/tables.service";
interface TestResult {
  testName: string;
  marks: number;
  passStatus: boolean;
  maxMark: number;
}

interface SpecialNotice {
  specialNoticeID: number;
  message: string;
  mediaLink: string;
  userList: any; // You might want to define a specific type for userList if used
}

interface Payment {
  paymentId: number;
  type: string;
  amount: number;
  dueDate: string; // ISO string from backend
  paidDate: string | null; // ISO string or null
  paid: boolean;
}

interface StudentData {
  fullName: string;
  dob: string; // ISO string from backend
  programme: string;
  gender: string;
  allergies: string | null;
  specialNotice: string | null;
  parentName: string;
  relationship: string;
  email: string;
  contact1: string;
  contactTwo: string;
  testResultsDTOList: TestResult[];
  allSpecialNoticeDTOList: SpecialNotice[];
  paymentDTOList: Payment[];
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  providers: [TablesService, DecimalPipe,DatePipe],
})
export class ResultsComponent {

  studentData: StudentData | null = null;
  loading: boolean = true;
  error: string | null = null;

  // For Pagination (ngx-pagination)
  testResultsPage: number = 1;
  itemsPerPage: number = 5; // Adjust as needed

  private destroy$ = new Subject<void>();

  constructor(
      private profileService: ProfileService,
      private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchStudentData();
  }

  fetchStudentData(): void {
    const userID = localStorage.getItem('user_id');
    if (!userID) {
      this.error = 'User ID not found.';
      this.loading = false;
      console.error('User ID not found in localStorage');
      return;
    }

    this.profileService.getStudentFullDetailsByID(userID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => { // Adjust 'any' if you have a specific response type
            console.log('Student Data Fetched:', response?.data);
            this.studentData = response?.data || null;
            this.error = null;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching student data:', err);
            this.error = 'Failed to load student data.';
            this.studentData = null;
            this.loading = false;
          }
        });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helper to format DOB using DatePipe
  getFormattedDob(): string | null {
    if (this.studentData?.dob) {
      // Parse the ISO string and format it. Adjust format string as needed (e.g., 'mediumDate', 'dd/MM/yyyy')
      return this.datePipe.transform(this.studentData.dob, 'MMM dd, yyyy');
    }
    return null;
  }

  // Helper to determine badge class for test result status
  getResultBadgeClass(passStatus: boolean): string {
    return passStatus ? 'badge-success' : 'badge-danger';
  }

  // Helper to determine text for test result status
  getResultStatusText(passStatus: boolean): string {
    return passStatus ? 'Pass' : 'Fail';
  }

  // Helper to sanitize media links if needed (basic check)
  sanitizeMediaLink(link: string): string {
    if (!link) return '';
    return link.trim(); // Basic sanitization, remove leading/trailing spaces
    // For more robust sanitization, consider using Angular's DomSanitizer
    // import { DomSanitizer } from '@angular/platform-browser';
    // constructor(... private sanitizer: DomSanitizer ...) {}
    // return this.sanitizer.bypassSecurityTrustUrl(link.trim());
  }
}
