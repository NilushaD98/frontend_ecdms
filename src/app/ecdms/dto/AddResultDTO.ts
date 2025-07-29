export class ExamResultDTO {
    constructor(
        public resultID: number | null = null,
        public student: number | null = null,
        public testType: number | null = null,
        public score: number = 0,
        public passScore: number = 0,
        public passStatus: boolean = false
    ) {}
}