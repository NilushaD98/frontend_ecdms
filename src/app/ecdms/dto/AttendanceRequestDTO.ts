export class AttendanceRequestDTO{
    attendanceDate:Date;
    constructor(attendanceDate: Date) {
        this.attendanceDate = attendanceDate;
    }
}
export class AttendanceMarkDTO {
    constructor(
        public date: Date,
        public present: boolean,
        public remark: string,
        public student: number | null,
        public teacher: number | null
    ) {}
}