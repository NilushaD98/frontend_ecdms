export class AddTeacherDTO {
    teacherID?: number;
    fullName: string = '';
    contact: string = '';
    nic: string = '';
    dob: string = ''; // ISO date string
    email: string = '';
    gender: string = '';
    address: string = '';
    salary: number = 0;
    joiningDate: string = ''; // ISO date string
    classroomList: number[] = [];
}