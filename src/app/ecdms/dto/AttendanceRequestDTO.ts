export class AttendanceRequestDTO{
    attendanceDate:Date;
    classType:number;
    constructor(attendanceDate: Date,classType:number) {
        this.attendanceDate = attendanceDate;
        this.classType = classType;
    }
}
export class AttendanceMarkDTO {
    constructor(
        public date: Date,
        public present: boolean,
        public remark: string,
        public type:string,
        public student: number | null,
        public teacher: number | null
    ) {}
}
