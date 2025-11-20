import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { format, parseISO } from 'date-fns';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-salary',
  templateUrl: './teacher-salary.component.html',
  styleUrl: './teacher-salary.component.scss'
})
export class TeacherSalaryComponent implements OnInit {

  teachers: any[] = [];
  selectedTeacher: any = null;
  selectedMonth: string = '';
  selectedYear: number = new Date().getFullYear();
  salaryAmount: number = 0;
  salaryHistory: any[] = [];
  addSalarySection:boolean = false;
  
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.loadTeachers();
    const userType = localStorage.getItem('user_type');
    if(userType == 'ADMIN'){
      this.addSalarySection = true;
    }
    else {
      this.selectedTeacher = localStorage.getItem('user_id');
      this.loadSalaryHistory();
    }
  }

  loadTeachers() {
    this.http.get('http://localhost:9090/user/get-all-teachers').subscribe(
      (res: any) => {
        this.teachers = res.data || [];
      },
      (error) => {
        console.error('Error loading teachers:', error);
      }
    );
  }

  onTeacherChange() {
    if (this.selectedTeacher) {
      this.loadSalaryHistory();
    }
  }

  loadSalaryHistory() {
    this.http.get(`http://localhost:9090/salary/get-teacher-salaries/${this.selectedTeacher}`).subscribe(
      (res: any) => {
        this.salaryHistory = res.data || [];
      },
      (error) => {
        console.error('Error loading salary history:', error);
        this.salaryHistory = [];
      }
    );
  }

  addSalary() {
    if (!this.selectedTeacher || !this.selectedMonth || !this.selectedYear || !this.salaryAmount) {
      Swal.fire('Error', 'Please fill all fields.', 'error');
      return;
    }

    const salaryData = {
      teacherId: this.selectedTeacher,
      month: this.selectedMonth,
      year: this.selectedYear,
      amount: this.salaryAmount
    };

    this.http.post('http://localhost:9090/salary/add-teacher-salary', salaryData).subscribe(
      (res: any) => {
        if (res.success) {
          Swal.fire('Success', 'Salary added successfully!', 'success');
          this.resetForm();
          this.loadSalaryHistory();
        } else {
          Swal.fire('Error', 'Failed to add salary.', 'error');
        }
      },
      (error) => {
        console.error('Error adding salary:', error);
        Swal.fire('Error', 'Failed to add salary.', 'error');
      }
    );
  }

  resetForm() {
    this.selectedMonth = '';
    this.selectedYear = new Date().getFullYear();
    this.salaryAmount = 0;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  }

  getTeacherName(teacherId: number): string {
    const teacher = this.teachers.find(t => t.teacherID == teacherId);
    console.log(teacher)
    return teacher ? teacher.fullName : 'Unknown Teacher';
  }
}
