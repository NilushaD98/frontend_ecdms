import { Component } from '@angular/core';
import {ProfileService} from "../../service/profile-service/profile.service";
import {addMonths, subMonths} from "date-fns";
import {Subject} from "rxjs";
import {CalendarEvent} from "angular-calendar";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {

  user: any;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  attendanceEvents: CalendarEvent[] = []; // Initialize as empty array

  // For subscription management to prevent memory leaks
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public usp: ProfileService) {}

  // Move data fetching to ngOnInit lifecycle hook
  ngOnInit(): void {
    this.fetchAttendanceData();
  }

  fetchAttendanceData() {
    const userID = localStorage.getItem('user_id');
    if (userID) { // Check if userID exists
      this.usp.getStudentFullDetailsByID(userID)
          .pipe(takeUntil(this.destroy$)) // Unsubscribe when component is destroyed
          .subscribe(
              (res: any) => {
                console.log('Raw Attendance Data:', res.data.attendanceDTOList);

                if (res?.data?.attendanceDTOList && Array.isArray(res.data.attendanceDTOList)) {
                  // Transform backend data into CalendarEvent format
                  this.attendanceEvents = res.data.attendanceDTOList.map((item: any) => {
                    const eventDate = new Date(item.date); // Parse the date string

                    // Determine color based on presence (optional)
                    const eventColor = item.present
                        ? { primary: '#28a745', secondary: '#c3e6cb' } // Green for Present
                        : { primary: '#dc3545', secondary: '#f5c6cb' }; // Red for Absent

                    // Create the CalendarEvent object
                    const calendarEvent: CalendarEvent = {
                      start: eventDate, // Required: Date object
                      title: item.present ? 'Present' : 'Absent', // Required: String title
                      color: eventColor, // Optional: Custom color
                      // You can add more properties like 'meta' to store the original item data
                      meta: item // Store original data if needed for click events etc.
                    };

                    return calendarEvent;
                  });

                  console.log('Transformed Calendar Events:', this.attendanceEvents);

                  // Trigger calendar refresh after data is loaded
                  this.refresh.next({});
                } else {
                  console.warn('Attendance data not found or invalid format in response:', res);
                  this.attendanceEvents = []; // Ensure events are cleared if data is invalid
                }
              },
              (error) => {
                console.error('Error fetching attendance data:', error);
                this.attendanceEvents = []; // Clear events on error
              }
          );
    } else {
      console.error('User ID not found in localStorage');
      this.attendanceEvents = [];
    }
  }


  nextMonth() {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  previousMonth() {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  // Implement ngOnDestroy to complete the destroy$ subject
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Optional: Handle event clicks
  // eventClicked({ event }: { event: CalendarEvent }): void {
  //   console.log('Event clicked:', event);
  //   // Access original data via event.meta if needed
  //   // alert(`Event: ${event.title}, Date: ${event.start}`);
  // }

}
