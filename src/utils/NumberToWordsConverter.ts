// number-to-words.converter.ts
export class NumberToWordsConverter {
    private ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    private teens = ['ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    private tens = ['', 'TEN', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    private thousands = ['', 'THOUSAND', 'MILLION', 'BILLION'];

    private convert_hundreds(number: number): string {
        let result = '';
        if (number > 99) {
            result += this.ones[Math.floor(number / 100)] + ' HUNDRED ';
            number = number % 100;
        }
        if (number > 10 && number < 20) {
            result += this.teens[number - 11] + ' ';
        } else {
            result += this.tens[Math.floor(number / 10)] + ' ';
            result += this.ones[number % 10] + ' ';
        }
        return result.trim();
    }

    private convert_thousands(number: number): string {
        let result = '';
        let thousandCount = 0;

        while (number > 0) {
            if (number % 1000 != 0) {
                result = this.convert_hundreds(number % 1000) + ' ' + this.thousands[thousandCount] + ' ' + result;
            }
            number = Math.floor(number / 1000);
            thousandCount++;
        }

        return result.trim();
    }

    public convert_to_words(number: number): string {
        if (number === 0) return 'ZERO';
        return this.convert_thousands(number);
    }
}

export function convertCurrencyToWords(amount: number): string {
    const converter = new NumberToWordsConverter();

    const rupees = Math.floor(amount); // Integer part (Rupees)
    const paise = Math.round((amount - rupees) * 100); // Decimal part (Cents/Paise)

    let rupeesInWords = converter.convert_to_words(rupees) + ' RUPEES';
    let paiseInWords = paise > 0 ? ' AND ' + converter.convert_to_words(paise) + ' CENTS' : '';

    return rupeesInWords + paiseInWords + ' ONLY';
}
