export class AppointmentDTO {
    constructor(
        public appointmentId:number | null,
        public studentID: number  | null,
        public studentName: string  | null,
        public reason: string | null,
        public scheduledTime: Date |  null,
        public confirmed: boolean | null
    ) {}
}