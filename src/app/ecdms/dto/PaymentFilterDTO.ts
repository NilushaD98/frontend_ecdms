export class PaymentFilterDTO {
    studentID: number | null;
    paidStatus: boolean | null;
    type: string | null;

    constructor(studentID: number | null = null, paidStatus: boolean = false, type: string = '') {
        this.studentID = studentID;
        this.paidStatus = paidStatus;
        this.type = type;
    }
}

export class PaymentDTO {
    paymentId: number;
    type: string;
    amount: number;
    dueDate: Date;
    paidDate: Date | null;
    paid: boolean;

    constructor(
        paymentId: number = 0,
        type: string = '',
        amount: number = 0,
        dueDate: Date = new Date(),
        paidDate: Date | null = null,
        paid: boolean = false
    ) {
        this.paymentId = paymentId;
        this.type = type;
        this.amount = amount;
        this.dueDate = dueDate;
        this.paidDate = paidDate;
        this.paid = paid;
    }
}