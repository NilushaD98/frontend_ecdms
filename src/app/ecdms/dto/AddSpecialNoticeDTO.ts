// add-special-notice.model.ts
export class AddSpecialNoticeDTO {
    specialNoticeID?: number | null;
    message: string = '';
    mediaLink?: string | null;
    userList: number[] = [];

    constructor(init?: Partial<AddSpecialNoticeDTO>) {
        Object.assign(this, init);
    }

    // Optional: method to convert to FormData (for file upload)
    toFormData(): FormData {
        const formData = new FormData();
        if (this.specialNoticeID != null) {
            formData.append('specialNoticeID', this.specialNoticeID.toString());
        }
        formData.append('message', this.message);
        if (this.mediaLink) {
            formData.append('mediaLink', this.mediaLink);
        }
        this.userList.forEach(userId => {
            formData.append('userList', userId.toString());
        });
        return formData;
    }
}

export class NoticesRequestDTO {
    user: number | null | undefined; // Integer in Java can be null, so reflect that
    readStatus: boolean = false; // Boolean primitive, defaulting to false like Java's default for boolean fields

    constructor(user?: number |null, readStatus: boolean = false) {
        this.user = user;
        this.readStatus = readStatus;
    }
}