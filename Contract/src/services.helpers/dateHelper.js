class DateHelper {


    /**
     * 
     * @param {Date} startDate 
     * @param {Date} endDate 
     * @returns An array of dates in between.
     */
    static getDatesArrayInBewtween(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    /**
     * Check if a given date is included in the given range.
     * @param {Date} dateToCheck 
     * @param {Date} startDate 
     * @param {Date} endDate 
     * @returns Boolean
     */
    static isDateInRange(dateToCheck, startDate, endDate) {
        const dateToCheckTime = new Date(dateToCheck).getTime();
        const startDateToCheck = new Date(startDate).getTime();
        const endDateToCheck = new Date(endDate).getTime();

        return dateToCheckTime >= startDateToCheck && dateToCheckTime <= endDateToCheck;
    }

}

export default DateHelper;