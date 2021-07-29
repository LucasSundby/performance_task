const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default class Util {
    /**
     * Formats a date as "`Month Day, Year`", e.g. "`June 18, 2020`"
     *
     * @param {Date} date The date to format.
     */
    static formatDate(date: Date): string {
        return `${months[date.getMonth()]} ${Util.zeroPad(date.getDate())}, ${date.getFullYear()}`;
    }

    /**
     * Zero-pads a single digit number into a two digit number, e.g. `1` -> `01`.
     *
     * @param {number} n The number to pad.
     */
    static zeroPad(n: number): string {
        return n < 10 ? `0${n}` : String(n);
    }
}
