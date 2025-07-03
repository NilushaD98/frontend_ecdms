export class TestTypeDTO {
    constructor(
        public testTypeID: number | null,
        public testName: string,
        public description: string,
        public testDate: Date | null
    ) {}

    // Optional: Convert to JSON (you can also let Angular handle this)
    toJson() {
        return {
            testTypeID: this.testTypeID,
            testName: this.testName,
            description: this.description,
            testDate: this.testDate?.toISOString() || null
        };
    }
}