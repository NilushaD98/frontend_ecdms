import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from "../../service/profile-service/profile.service";
import { Subject, throwError } from "rxjs";
import { takeUntil, catchError } from "rxjs/operators";
import { format, isAfter, isBefore, parseISO } from 'date-fns'; // Import date-fns functions
import { HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {

  paymentDetails: any[] = []; // Initialize array
  upcomingPayments: any[] = []; // For upcoming/due payments
  overduePayments: any[] = []; // For overdue payments
  paidPayments: any[] = []; // For paid payments

  // Upload popup properties
  selectedPayment: any = null;
  files: File[] = [];
  uploadedImageUrl: string = '';
  uploading = false;
  pendingApprovalPayments: any[] = [];


  // Cloudinary config
  private cloudName = 'dsc7devgs';
  private uploadPreset = 'ecdmstemplate';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public usp: ProfileService,
    private http: HttpClient,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.fetchPaymentData();
  }

  fetchPaymentData() {
    const userID = localStorage.getItem('user_id');
    if (userID) {
      this.usp.getStudentFullDetailsByID(userID)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
              (res: any) => {
                console.log('Raw Payment Data:', res.data);
                if (res?.data?.paymentDTOList && Array.isArray(res.data.paymentDTOList)) {
                  this.paymentDetails = res.data.paymentDTOList;

                  // Categorize and sort payments
                  this.categorizePayments();
                } else {
                  console.warn('Payment data not found or invalid format in response:', res);
                  this.paymentDetails = [];
                  this.resetCategories();
                }
              },
              (error) => {
                console.error('Error fetching payment data:', error);
                this.paymentDetails = [];
                this.resetCategories();
              }
          );
    } else {
      console.error('User ID not found in localStorage');
      this.resetCategories();
    }
  }

  private resetCategories() {
    this.upcomingPayments = [];
    this.overduePayments = [];
    this.paidPayments = [];
    this.pendingApprovalPayments = [];
  }

  private categorizePayments() {
    const now = new Date();
    const upcoming: any[] = [];
    const overdue: any[] = [];
    const paid: any[] = [];
    const pendingApproval: any[] = [];

    this.paymentDetails.forEach(payment => {
      const dueDate = parseISO(payment.dueDate); // Convert string to Date object

      if (payment.isPendingApprove === true) {
        pendingApproval.push({ ...payment, parsedDueDate: dueDate });
      } else if (payment.paid) {
        paid.push({ ...payment, parsedDueDate: dueDate }); // Add parsed date for sorting
      } else {
        if (isBefore(dueDate, now)) { // Due date is in the past
          overdue.push({ ...payment, parsedDueDate: dueDate });
        } else { // Due date is today or in the future
          upcoming.push({ ...payment, parsedDueDate: dueDate });
        }
      }
    });

    // Sort upcoming by due date (ascending)
    this.upcomingPayments = upcoming.sort((a, b) => a.parsedDueDate.getTime() - b.parsedDueDate.getTime());

    // Sort overdue by due date (ascending - oldest first)
    this.overduePayments = overdue.sort((a, b) => a.parsedDueDate.getTime() - b.parsedDueDate.getTime());

    // Sort paid by paid date (descending - newest first)
    this.paidPayments = paid.sort((a, b) => {
      const paidDateA = a.paidDate ? parseISO(a.paidDate).getTime() : 0;
      const paidDateB = b.paidDate ? parseISO(b.paidDate).getTime() : 0;
      return paidDateB - paidDateA; // Descending order
    });

    // Sort pending approval by due date (ascending)
    this.pendingApprovalPayments = pendingApproval.sort((a, b) => a.parsedDueDate.getTime() - b.parsedDueDate.getTime());

    console.log('Upcoming Payments:', this.upcomingPayments);
    console.log('Overdue Payments:', this.overduePayments);
    console.log('Paid Payments:', this.paidPayments);
    console.log('Pending Approval Payments:', this.pendingApprovalPayments);
  }

  // Helper method to format dates for display
  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      // Customize format as needed, e.g., 'MMM dd, yyyy h:mm a'
      return format(date, 'MMM dd, yyyy'); // For due dates
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  }

  formatDateTime(dateTimeString: string | null): string {
    if (!dateTimeString) return 'N/A';
    try {
      const date = parseISO(dateTimeString);
      // Customize format as needed, e.g., 'MMM dd, yyyy h:mm a'
      return format(date, 'MMM dd, yyyy h:mm a'); // For paid dates/times
    } catch (error) {
      console.error('Error formatting date/time:', dateTimeString, error);
      return 'Invalid Date/Time';
    }
  }

  // Helper method to get status class for styling
  getPaymentStatusClass(payment: any): string {
    if (payment.paid) {
      return 'paid';
    } else {
      const dueDate = parseISO(payment.dueDate);
      if (isBefore(dueDate, new Date())) {
        return 'overdue';
      } else {
        return 'pending';
      }
    }
  }

  // Helper method to get status text
  getPaymentStatusText(payment: any): string {
    if (payment.paid) {
      return 'Paid';
    } else {
      const dueDate = parseISO(payment.dueDate);
      if (isBefore(dueDate, new Date())) {
        return 'Overdue';
      } else {
        return 'Pending';
      }
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByPaymentId(index: number, item: any): any {
    return item?.paymentId; // Return a unique identifier, handle potential undefined item
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  // Upload popup methods
  openUploadPopup(payment: any, content: any) {
    this.selectedPayment = payment;
    this.resetUploadForm();
    this.modalService.open(content, { size: 'lg' });
  }

  onSelect(event: any) {
    const file = event.addedFiles[0];
    this.files = [file];
    this.uploadToCloudinary(file);
  }

  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
  }

  uploadToCloudinary(file: File) {
    this.uploading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const httpOptions = {
      headers: new HttpHeaders({}),
    };

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;

    this.http.post(uploadUrl, formData, httpOptions)
      .pipe(
        catchError(err => {
          console.error('Upload to Cloudinary failed', err);
          Swal.fire('Error', 'Failed to upload receipt.', 'error');
          this.uploading = false;
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (response: any) => {
          Swal.fire('Success', 'Receipt uploaded successfully.', 'success');
          this.uploadedImageUrl = response.secure_url;
          this.uploading = false;
        }
      });
  }

  submitPayment() {
    if (!this.uploadedImageUrl) {
      Swal.fire('Error', 'Please upload a payment receipt.', 'error');
      return;
    }

    const paymentData = {
      ...this.selectedPayment,
      receiptUrl: this.uploadedImageUrl,
      submittedDate: new Date().toISOString()
    };

    this.http.post('http://localhost:9090/payment/payment-submit',paymentData).subscribe(
      (response: any) => {

        if(response.success){
          Swal.fire('Success', 'Payment receipt submitted successfully!', 'success');
          this.pendingApprovalPayments.push(paymentData);
          this.removeFromCurrentArrays(this.selectedPayment);
          this.resetUploadForm();
        }
      },
      (error) => {
        console.error('Error submitting payment receipt:', error);
        Swal.fire('Error', 'Failed to submit payment receipt.', 'error');
      }
    );
  }

  resetUploadForm() {
    this.files = [];
    this.uploadedImageUrl = '';
    this.uploading = false;
  }

  removeFromCurrentArrays(payment: any) {
    this.upcomingPayments = this.upcomingPayments.filter(p => p.paymentId !== payment.paymentId);
    this.overduePayments = this.overduePayments.filter(p => p.paymentId !== payment.paymentId);
  }
}
