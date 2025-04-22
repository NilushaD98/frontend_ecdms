export class AddStudentDTO {
    firstName: string = '';
    lastName: string = '';
    fullName: string = '';
    dob: Date = new Date(); // Default to current date
    gender: string = '';
    address: string = '';
    program: string = '';
    ageCategory: string = '';

    fullNameParent: string = '';
    relationship: string = '';
    email: string = '';
    contactOne: string = '';
    contactTwo: string = '';
}