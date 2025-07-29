import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from "../../service/profile-service/profile.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { format, isAfter, isBefore, parseISO } from 'date-fns'; // Import date-fns functions

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

  private destroy$: Subject<void> = new Subject<void>();

  constructor(public usp: ProfileService) {}

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
  }

  private categorizePayments() {
    const now = new Date();
    const upcoming: any[] = [];
    const overdue: any[] = [];
    const paid: any[] = [];

    this.paymentDetails.forEach(payment => {
      const dueDate = parseISO(payment.dueDate); // Convert string to Date object

      if (payment.paid) {
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

    console.log('Upcoming Payments:', this.upcomingPayments);
    console.log('Overdue Payments:', this.overduePayments);
    console.log('Paid Payments:', this.paidPayments);
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
}
